package com.mall.api.modules.catalog;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import com.mall.api.modules.catalog.entity.PlatformProductImage;
import com.mall.api.modules.catalog.entity.PlatformProductTranslation;
import com.mall.api.modules.catalog.mapper.PlatformProductImageMapper;
import com.mall.api.modules.catalog.mapper.PlatformProductMapper;
import com.mall.api.modules.catalog.mapper.PlatformProductTranslationMapper;
import com.mall.api.modules.category.entity.Category;
import com.mall.api.modules.category.mapper.CategoryMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.realtime.RealtimeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PlatformProductService {

    private final PlatformProductMapper platformProductMapper;
    private final PlatformProductImageMapper platformProductImageMapper;
    private final PlatformProductTranslationMapper platformProductTranslationMapper;
    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final MerchantMapper merchantMapper;
    private final RealtimeService realtimeService;

    public PlatformProductService(PlatformProductMapper platformProductMapper,
                                  PlatformProductImageMapper platformProductImageMapper,
                                  PlatformProductTranslationMapper platformProductTranslationMapper,
                                  CategoryMapper categoryMapper,
                                  ProductMapper productMapper,
                                  MerchantMapper merchantMapper,
                                  RealtimeService realtimeService) {
        this.platformProductMapper = platformProductMapper;
        this.platformProductImageMapper = platformProductImageMapper;
        this.platformProductTranslationMapper = platformProductTranslationMapper;
        this.categoryMapper = categoryMapper;
        this.productMapper = productMapper;
        this.merchantMapper = merchantMapper;
        this.realtimeService = realtimeService;
    }

    // ==================== ADMIN CATALOG METHODS ====================

    public Map<String, Object> getProducts(String keyword, Long categoryId, String status, int page, int pageSize) {
        LambdaQueryWrapper<PlatformProduct> wrapper = Wrappers.<PlatformProduct>lambdaQuery()
                .eq(PlatformProduct::getDeleted, false);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(PlatformProduct::getName, keyword)
                    .or().like(PlatformProduct::getModel, keyword)
                    .or().like(PlatformProduct::getBrand, keyword));
        }
        if (categoryId != null) {
            wrapper.eq(PlatformProduct::getCategoryId, categoryId);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(PlatformProduct::getStatus, status);
        }
        wrapper.orderByDesc(PlatformProduct::getUpdatedAt);
        Page<PlatformProduct> pg = platformProductMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (PlatformProduct pp : pg.getRecords()) {
            Map<String, Object> item = buildProductMap(pp);
            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getProductDetail(Long id) {
        PlatformProduct pp = platformProductMapper.selectById(id);
        if (pp == null || Boolean.TRUE.equals(pp.getDeleted())) {
            throw new BusinessException(404, "平台商品不存在");
        }
        Map<String, Object> detail = buildProductMap(pp);

        List<PlatformProductImage> images = platformProductImageMapper.selectList(
                Wrappers.<PlatformProductImage>lambdaQuery()
                        .eq(PlatformProductImage::getPlatformProductId, id)
                        .orderByAsc(PlatformProductImage::getSort));
        detail.put("images", images);

        List<PlatformProductTranslation> translations = platformProductTranslationMapper.selectList(
                Wrappers.<PlatformProductTranslation>lambdaQuery()
                        .eq(PlatformProductTranslation::getPlatformProductId, id));
        detail.put("translations", translations);

        return detail;
    }

    @Transactional
    public PlatformProduct createProduct(PlatformProduct data, List<PlatformProductImage> images,
                                          List<PlatformProductTranslation> translations, Long createdBy) {
        if (data.getMerchantPrice() == null || data.getMerchantPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException(400, "商家成本价必须大于等于0");
        }
        if (data.getMerchantPrice().compareTo(data.getSalePrice()) >= 0) {
            throw new BusinessException(400, "商家成本价必须小于销售价");
        }
        computeProfitFields(data);

        if (data.getBrand() == null || data.getBrand().isBlank()) {
            data.setBrand("DJI");
        }
        if (data.getStatus() == null || data.getStatus().isBlank()) {
            data.setStatus("ENABLE");
        }
        data.setCreatedBy(createdBy);
        data.setUpdatedBy(createdBy);
        data.setDeleted(false);
        data.setCreatedAt(LocalDateTime.now());
        data.setUpdatedAt(LocalDateTime.now());
        platformProductMapper.insert(data);

        saveImages(data.getId(), images);
        saveTranslations(data.getId(), translations);

        realtimeService.broadcast(RealtimeService.RealtimeEvent.of("PRODUCT_CATALOG_UPDATED",
                "platform_product", data.getId(), "平台商品创建",
                "平台商品 " + data.getName() + " 已创建", null));

        return data;
    }

    @Transactional
    public PlatformProduct updateProduct(Long id, PlatformProduct data, List<PlatformProductImage> images,
                                          List<PlatformProductTranslation> translations, Long updatedBy) {
        PlatformProduct existing = platformProductMapper.selectById(id);
        if (existing == null || Boolean.TRUE.equals(existing.getDeleted())) {
            throw new BusinessException(404, "平台商品不存在");
        }

        boolean priceChanged = data.getMerchantPrice() != null || data.getSalePrice() != null;
        if (data.getMerchantPrice() != null) existing.setMerchantPrice(data.getMerchantPrice());
        if (data.getSalePrice() != null) existing.setSalePrice(data.getSalePrice());
        if (data.getOriginalPrice() != null) existing.setOriginalPrice(data.getOriginalPrice());

        if (priceChanged) {
            if (existing.getMerchantPrice().compareTo(existing.getSalePrice()) >= 0) {
                throw new BusinessException(400, "商家成本价必须小于销售价");
            }
            computeProfitFields(existing);
        }

        if (data.getBrand() != null) existing.setBrand(data.getBrand());
        if (data.getName() != null) existing.setName(data.getName());
        if (data.getModel() != null) existing.setModel(data.getModel());
        if (data.getCategoryId() != null) existing.setCategoryId(data.getCategoryId());
        if (data.getDescription() != null) existing.setDescription(data.getDescription());
        if (data.getCoverImage() != null) existing.setCoverImage(data.getCoverImage());
        if (data.getStockMode() != null) existing.setStockMode(data.getStockMode());
        if (data.getGlobalStock() != null) existing.setGlobalStock(data.getGlobalStock());
        if (data.getSort() != null) existing.setSort(data.getSort());
        existing.setUpdatedBy(updatedBy);
        existing.setUpdatedAt(LocalDateTime.now());
        platformProductMapper.updateById(existing);

        if (images != null) {
            saveImages(id, images);
        }
        if (translations != null) {
            saveTranslations(id, translations);
        }

        Map<String, Object> payload = new HashMap<>();
        if (priceChanged) payload.put("priceChanged", true);
        payload.put("name", existing.getName());
        realtimeService.broadcast(RealtimeService.RealtimeEvent.of(
                priceChanged ? "PRODUCT_PRICE_UPDATED" : "PRODUCT_CATALOG_UPDATED",
                "platform_product", id, "平台商品更新",
                "平台商品 " + existing.getName() + " 已更新", payload));

        return existing;
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        PlatformProduct pp = platformProductMapper.selectById(id);
        if (pp == null || Boolean.TRUE.equals(pp.getDeleted())) {
            throw new BusinessException(404, "平台商品不存在");
        }
        pp.setStatus(status);
        pp.setUpdatedAt(LocalDateTime.now());
        platformProductMapper.updateById(pp);

        realtimeService.broadcast(RealtimeService.RealtimeEvent.of("PRODUCT_STATUS_UPDATED",
                "platform_product", id, "平台商品状态变更",
                "平台商品状态变更为 " + status, Map.of("status", status)));
    }

    @Transactional
    public void deleteProduct(Long id) {
        PlatformProduct pp = platformProductMapper.selectById(id);
        if (pp == null || Boolean.TRUE.equals(pp.getDeleted())) {
            throw new BusinessException(404, "平台商品不存在");
        }
        Long listingCount = productMapper.selectCount(
                Wrappers.<Product>lambdaQuery()
                        .eq(Product::getPlatformProductId, id)
                        .eq(Product::getDeleted, false));
        if (listingCount > 0) {
            throw new BusinessException(400, "该平台商品存在 " + listingCount + " 个商家上架记录，无法删除");
        }
        pp.setDeleted(true);
        pp.setUpdatedAt(LocalDateTime.now());
        platformProductMapper.updateById(pp);
    }

    // ==================== MERCHANT CATALOG METHODS ====================

    public Map<String, Object> getAvailableProducts(Long merchantId, String keyword, Long categoryId,
                                                      int page, int pageSize) {
        LambdaQueryWrapper<PlatformProduct> wrapper = Wrappers.<PlatformProduct>lambdaQuery()
                .eq(PlatformProduct::getDeleted, false)
                .eq(PlatformProduct::getStatus, "ENABLE");
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(PlatformProduct::getName, keyword)
                    .or().like(PlatformProduct::getModel, keyword)
                    .or().like(PlatformProduct::getBrand, keyword));
        }
        if (categoryId != null) {
            wrapper.eq(PlatformProduct::getCategoryId, categoryId);
        }
        wrapper.orderByDesc(PlatformProduct::getUpdatedAt);
        Page<PlatformProduct> pg = platformProductMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Long> ppIds = pg.getRecords().stream().map(PlatformProduct::getId).toList();
        List<Product> existingListings = ppIds.isEmpty() ? List.of() : productMapper.selectList(
                Wrappers.<Product>lambdaQuery()
                        .in(Product::getPlatformProductId, ppIds)
                        .eq(Product::getMerchantId, merchantId)
                        .eq(Product::getDeleted, false));
        Set<Long> listedPpIds = new HashSet<>();
        for (Product p : existingListings) {
            if (p.getPlatformProductId() != null) {
                listedPpIds.add(p.getPlatformProductId());
            }
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (PlatformProduct pp : pg.getRecords()) {
            Map<String, Object> item = buildProductMap(pp);
            item.put("alreadyListed", listedPpIds.contains(pp.getId()));
            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public Product listProduct(Long merchantId, Long platformProductId, Integer merchantStock, String listingStatus) {
        PlatformProduct pp = platformProductMapper.selectById(platformProductId);
        if (pp == null || Boolean.TRUE.equals(pp.getDeleted()) || !"ENABLE".equals(pp.getStatus())) {
            throw new BusinessException(400, "平台商品不可用");
        }

        Long existingCount = productMapper.selectCount(
                Wrappers.<Product>lambdaQuery()
                        .eq(Product::getPlatformProductId, platformProductId)
                        .eq(Product::getMerchantId, merchantId)
                        .eq(Product::getDeleted, false));
        if (existingCount > 0) {
            throw new BusinessException(400, "已上架该平台商品，请勿重复操作");
        }

        Product product = new Product();
        product.setMerchantId(merchantId);
        product.setPlatformProductId(platformProductId);
        product.setCategoryId(pp.getCategoryId());
        product.setTitle(pp.getName());
        product.setDescription(null);
        product.setPrice(pp.getSalePrice());
        product.setOriginalPrice(pp.getOriginalPrice());
        product.setUsePlatformPrice(true);
        product.setListingStatus(listingStatus != null ? listingStatus : "DRAFT");
        product.setMerchantStock(merchantStock != null ? merchantStock : 0);
        product.setStock(merchantStock != null ? merchantStock : 0);
        product.setSalesCount(0);
        product.setAuditStatus("APPROVED");
        product.setDeleted(false);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        if ("ON_SALE".equals(listingStatus)) {
            product.setStatus("ON_SALE");
        } else {
            product.setStatus("DRAFT");
        }
        productMapper.insert(product);

        realtimeService.sendToMerchant(merchantId, RealtimeService.RealtimeEvent.of("MERCHANT_LISTING_UPDATED",
                "product", product.getId(), "商品上架", "已上架平台商品 " + pp.getName(), null));

        return product;
    }

    public Map<String, Object> getMerchantListings(Long merchantId, String listingStatus, Long categoryId,
                                                     String keyword, int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getMerchantId, merchantId)
                .isNotNull(Product::getPlatformProductId)
                .eq(Product::getDeleted, false);
        if (listingStatus != null && !listingStatus.isBlank()) {
            wrapper.eq(Product::getListingStatus, listingStatus);
        }
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        wrapper.orderByDesc(Product::getUpdatedAt);
        Page<Product> pg = productMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (Product p : pg.getRecords()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("merchantId", p.getMerchantId());
            item.put("platformProductId", p.getPlatformProductId());
            item.put("merchantStock", p.getMerchantStock());
            item.put("listingStatus", p.getListingStatus());
            item.put("status", p.getStatus());
            item.put("usePlatformPrice", p.getUsePlatformPrice());
            item.put("listedAt", p.getListedAt());
            item.put("createdAt", p.getCreatedAt());
            item.put("updatedAt", p.getUpdatedAt());

            if (p.getPlatformProductId() != null) {
                PlatformProduct pp = platformProductMapper.selectById(p.getPlatformProductId());
                if (pp != null) {
                    item.put("platformName", pp.getName());
                    item.put("platformProductName", pp.getName());
                    item.put("platformProductModel", pp.getModel());
                    item.put("brand", pp.getBrand());
                    item.put("model", pp.getModel());
                    item.put("salePrice", pp.getSalePrice());
                    item.put("merchantPrice", pp.getMerchantPrice());
                    item.put("profitAmount", pp.getProfitAmount());
                    item.put("stockMode", pp.getStockMode());
                    item.put("globalStock", pp.getGlobalStock());
                    item.put("ppStatus", pp.getStatus());
                }
            }
            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getAdminListings(Long merchantId, Long platformProductId, String listingStatus,
                                                 String merchantKeyword, int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .isNotNull(Product::getPlatformProductId)
                .eq(Product::getDeleted, false);
        if (merchantId != null) {
            wrapper.eq(Product::getMerchantId, merchantId);
        }
        if (platformProductId != null) {
            wrapper.eq(Product::getPlatformProductId, platformProductId);
        }
        if (listingStatus != null && !listingStatus.isBlank()) {
            wrapper.eq(Product::getListingStatus, listingStatus);
        }
        if (merchantKeyword != null && !merchantKeyword.isBlank()) {
            List<Long> merchantIds = merchantMapper.selectList(Wrappers.<Merchant>lambdaQuery()
                            .eq(Merchant::getDeleted, false)
                            .like(Merchant::getShopName, merchantKeyword))
                    .stream()
                    .map(Merchant::getId)
                    .toList();
            if (merchantIds.isEmpty()) {
                Map<String, Object> empty = new HashMap<>();
                empty.put("list", List.of());
                empty.put("total", 0);
                empty.put("page", page);
                empty.put("pageSize", pageSize);
                return empty;
            }
            wrapper.in(Product::getMerchantId, merchantIds);
        }
        wrapper.orderByDesc(Product::getUpdatedAt);

        Page<Product> pg = productMapper.selectPage(new Page<>(page, pageSize), wrapper);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Product p : pg.getRecords()) {
            list.add(buildListingMap(p));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public void adminDisableListing(Long listingId) {
        Product product = productMapper.selectById(listingId);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())
                || product.getPlatformProductId() == null) {
            throw new BusinessException(404, "Listing not found");
        }
        product.setListingStatus("OFF_SALE");
        product.setStatus("OFF_SALE");
        product.setUpdatedAt(LocalDateTime.now());
        productMapper.updateById(product);
    }

    @Transactional
    public Product updateListing(Long merchantId, Long listingId, Integer merchantStock, String listingStatus) {
        Product product = productMapper.selectById(listingId);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())
                || !product.getMerchantId().equals(merchantId)) {
            throw new BusinessException(404, "上架记录不存在");
        }

        if (merchantStock != null) {
            product.setMerchantStock(merchantStock);
            product.setStock(merchantStock);
        }
        if (listingStatus != null) {
            product.setListingStatus(listingStatus);
            if ("ON_SALE".equals(listingStatus)) {
                product.setStatus("ON_SALE");
            } else if ("OFF_SALE".equals(listingStatus)) {
                product.setStatus("OFF_SALE");
            } else if ("DRAFT".equals(listingStatus)) {
                product.setStatus("DRAFT");
            }
        }
        product.setUpdatedAt(LocalDateTime.now());
        productMapper.updateById(product);
        return product;
    }

    @Transactional
    public void deleteListing(Long merchantId, Long listingId) {
        Product product = productMapper.selectById(listingId);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())
                || !product.getMerchantId().equals(merchantId)) {
            throw new BusinessException(404, "上架记录不存在");
        }
        product.setDeleted(true);
        product.setUpdatedAt(LocalDateTime.now());
        productMapper.updateById(product);

        realtimeService.sendToMerchant(merchantId, RealtimeService.RealtimeEvent.of("MERCHANT_LISTING_UPDATED",
                "product", listingId, "商品下架", "已下架商品", null));
    }

    private Map<String, Object> buildListingMap(Product p) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", p.getId());
        item.put("merchantId", p.getMerchantId());
        item.put("platformProductId", p.getPlatformProductId());
        item.put("merchantStock", p.getMerchantStock());
        item.put("listingStatus", p.getListingStatus());
        item.put("status", p.getStatus());
        item.put("listedAt", p.getListedAt());
        item.put("createdAt", p.getCreatedAt());
        item.put("updatedAt", p.getUpdatedAt());

        if (p.getMerchantId() != null) {
            Merchant merchant = merchantMapper.selectById(p.getMerchantId());
            if (merchant != null) {
                item.put("merchantName", merchant.getShopName());
            }
        }

        if (p.getPlatformProductId() != null) {
            PlatformProduct pp = platformProductMapper.selectById(p.getPlatformProductId());
            if (pp != null) {
                item.put("platformProductName", pp.getName());
                item.put("platformProductModel", pp.getModel());
                item.put("salePrice", pp.getSalePrice());
                item.put("merchantPrice", pp.getMerchantPrice());
                item.put("profitAmount", pp.getProfitAmount());
            }
        }
        return item;
    }

    // ==================== HELPER METHODS ====================

    private void computeProfitFields(PlatformProduct pp) {
        BigDecimal profitAmount = pp.getSalePrice().subtract(pp.getMerchantPrice());
        pp.setProfitAmount(profitAmount);
        if (pp.getMerchantPrice().compareTo(BigDecimal.ZERO) > 0) {
            pp.setProfitRate(profitAmount.divide(pp.getMerchantPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)));
        } else {
            pp.setProfitRate(BigDecimal.ZERO);
        }
    }

    private void saveImages(Long platformProductId, List<PlatformProductImage> images) {
        platformProductImageMapper.delete(
                Wrappers.<PlatformProductImage>lambdaQuery()
                        .eq(PlatformProductImage::getPlatformProductId, platformProductId));
        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                PlatformProductImage img = images.get(i);
                img.setPlatformProductId(platformProductId);
                img.setSort(img.getSort() != null ? img.getSort() : i);
                img.setCreatedAt(LocalDateTime.now());
                platformProductImageMapper.insert(img);
            }
        }
    }

    private void saveTranslations(Long platformProductId, List<PlatformProductTranslation> translations) {
        platformProductTranslationMapper.delete(
                Wrappers.<PlatformProductTranslation>lambdaQuery()
                        .eq(PlatformProductTranslation::getPlatformProductId, platformProductId));
        if (translations != null && !translations.isEmpty()) {
            for (PlatformProductTranslation t : translations) {
                t.setPlatformProductId(platformProductId);
                t.setCreatedAt(LocalDateTime.now());
                t.setUpdatedAt(LocalDateTime.now());
                platformProductTranslationMapper.insert(t);
            }
        }
    }

    private Map<String, Object> buildProductMap(PlatformProduct pp) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", pp.getId());
        item.put("brand", pp.getBrand());
        item.put("name", pp.getName());
        item.put("model", pp.getModel());
        item.put("categoryId", pp.getCategoryId());
        item.put("description", pp.getDescription());
        item.put("coverImage", pp.getCoverImage());
        item.put("merchantPrice", pp.getMerchantPrice());
        item.put("salePrice", pp.getSalePrice());
        item.put("originalPrice", pp.getOriginalPrice());
        item.put("profitAmount", pp.getProfitAmount());
        item.put("profitRate", pp.getProfitRate());
        item.put("stockMode", pp.getStockMode());
        item.put("globalStock", pp.getGlobalStock());
        item.put("sort", pp.getSort());
        item.put("status", pp.getStatus());
        item.put("createdBy", pp.getCreatedBy());
        item.put("updatedBy", pp.getUpdatedBy());
        item.put("createdAt", pp.getCreatedAt());
        item.put("updatedAt", pp.getUpdatedAt());

        if (pp.getCategoryId() != null) {
            Category category = categoryMapper.selectById(pp.getCategoryId());
            if (category != null) {
                item.put("categoryName", category.getName());
            }
        }

        return item;
    }
}
