package com.mall.api.modules.product;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import com.mall.api.modules.catalog.entity.PlatformProductImage;
import com.mall.api.modules.catalog.entity.PlatformProductTranslation;
import com.mall.api.modules.catalog.mapper.PlatformProductImageMapper;
import com.mall.api.modules.catalog.mapper.PlatformProductMapper;
import com.mall.api.modules.catalog.mapper.PlatformProductTranslationMapper;
import com.mall.api.modules.category.entity.Category;
import com.mall.api.modules.category.entity.CategoryTranslation;
import com.mall.api.modules.category.mapper.CategoryMapper;
import com.mall.api.modules.category.mapper.CategoryTranslationMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.entity.ProductImage;
import com.mall.api.modules.product.entity.ProductTranslation;
import com.mall.api.modules.product.mapper.ProductImageMapper;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.product.mapper.ProductTranslationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final ProductTranslationMapper productTranslationMapper;
    private final PlatformProductMapper platformProductMapper;
    private final PlatformProductImageMapper platformProductImageMapper;
    private final PlatformProductTranslationMapper platformProductTranslationMapper;
    private final CategoryMapper categoryMapper;
    private final CategoryTranslationMapper categoryTranslationMapper;
    private final MerchantMapper merchantMapper;

    public ProductService(ProductMapper productMapper, ProductImageMapper productImageMapper,
                          ProductTranslationMapper productTranslationMapper,
                          PlatformProductMapper platformProductMapper,
                          PlatformProductImageMapper platformProductImageMapper,
                          PlatformProductTranslationMapper platformProductTranslationMapper,
                          CategoryMapper categoryMapper,
                          CategoryTranslationMapper categoryTranslationMapper,
                          MerchantMapper merchantMapper) {
        this.productMapper = productMapper;
        this.productImageMapper = productImageMapper;
        this.productTranslationMapper = productTranslationMapper;
        this.platformProductMapper = platformProductMapper;
        this.platformProductImageMapper = platformProductImageMapper;
        this.platformProductTranslationMapper = platformProductTranslationMapper;
        this.categoryMapper = categoryMapper;
        this.categoryTranslationMapper = categoryTranslationMapper;
        this.merchantMapper = merchantMapper;
    }

    public Page<Product> getProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                      String sort, int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getDeleted, false)
                .eq(Product::getAuditStatus, "APPROVED")
                .and(w -> w.eq(Product::getStatus, "ON_SALE")
                        .or().isNotNull(Product::getPlatformProductId).eq(Product::getListingStatus, "ON_SALE"));
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Product::getTitle, keyword).or().like(Product::getDescription, keyword));
        }
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (minPrice != null) {
            wrapper.ge(Product::getPrice, minPrice);
        }
        if (maxPrice != null) {
            wrapper.le(Product::getPrice, maxPrice);
        }
        if ("price_asc".equals(sort)) {
            wrapper.orderByAsc(Product::getPrice);
        } else if ("price_desc".equals(sort)) {
            wrapper.orderByDesc(Product::getPrice);
        } else if ("sales_desc".equals(sort)) {
            wrapper.orderByDesc(Product::getSalesCount);
        } else {
            wrapper.orderByDesc(Product::getCreatedAt);
        }
        return productMapper.selectPage(new Page<>(page, pageSize), wrapper);
    }

    public List<Map<String, Object>> getProductsWithTranslation(String keyword, Long categoryId, BigDecimal minPrice,
                                                                  BigDecimal maxPrice, String sort, int page, int pageSize,
                                                                  String countryCode, String languageCode) {
        Page<Product> productPage = getProducts(keyword, categoryId, minPrice, maxPrice, sort, page, pageSize);
        List<Product> products = productPage.getRecords();
        List<Long> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

        List<Long> ppIds = products.stream().filter(p -> p.getPlatformProductId() != null)
                .map(Product::getPlatformProductId).distinct().collect(Collectors.toList());
        Map<Long, PlatformProduct> ppMap = new HashMap<>();
        Map<Long, PlatformProductTranslation> ppTransMap = new HashMap<>();
        if (!ppIds.isEmpty()) {
            List<PlatformProduct> ppList = platformProductMapper.selectBatchIds(ppIds);
            for (PlatformProduct pp : ppList) {
                ppMap.put(pp.getId(), pp);
            }
            LambdaQueryWrapper<PlatformProductTranslation> ptw = Wrappers.<PlatformProductTranslation>lambdaQuery()
                    .in(PlatformProductTranslation::getPlatformProductId, ppIds);
            if (countryCode != null && !countryCode.isBlank()) {
                ptw.eq(PlatformProductTranslation::getCountryCode, countryCode);
            }
            if (languageCode != null && !languageCode.isBlank()) {
                ptw.eq(PlatformProductTranslation::getLanguageCode, languageCode);
            }
            List<PlatformProductTranslation> pptList = platformProductTranslationMapper.selectList(ptw);
            for (PlatformProductTranslation t : pptList) {
                if (!ppTransMap.containsKey(t.getPlatformProductId())) {
                    ppTransMap.put(t.getPlatformProductId(), t);
                }
            }
        }

        Map<Long, ProductTranslation> translationMap = new HashMap<>();
        if (productIds.size() > 0) {
            LambdaQueryWrapper<ProductTranslation> tw = Wrappers.<ProductTranslation>lambdaQuery()
                    .in(ProductTranslation::getProductId, productIds);
            if (countryCode != null && !countryCode.isBlank()) {
                tw.eq(ProductTranslation::getCountryCode, countryCode);
            }
            if (languageCode != null && !languageCode.isBlank()) {
                tw.eq(ProductTranslation::getLanguageCode, languageCode);
            }
            List<ProductTranslation> translations = productTranslationMapper.selectList(tw);
            for (ProductTranslation t : translations) {
                if (!translationMap.containsKey(t.getProductId())) {
                    translationMap.put(t.getProductId(), t);
                }
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (Product p : products) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("categoryId", p.getCategoryId());
            item.put("createdAt", p.getCreatedAt());

            if (p.getPlatformProductId() != null) {
                PlatformProduct pp = ppMap.get(p.getPlatformProductId());
                PlatformProductTranslation ppt = ppTransMap.get(p.getPlatformProductId());
                item.put("title", ppt != null && ppt.getName() != null ? ppt.getName()
                        : (pp != null ? pp.getName() : p.getTitle()));
                item.put("description", ppt != null && ppt.getDescription() != null ? ppt.getDescription()
                        : p.getDescription());
                item.put("price", pp != null ? pp.getSalePrice() : p.getPrice());
                item.put("originalPrice", pp != null ? pp.getOriginalPrice() : p.getOriginalPrice());
                item.put("coverImage", p.getCoverImage());
                item.put("stock", pp != null && "PLATFORM_GLOBAL".equals(pp.getStockMode())
                        ? (pp.getGlobalStock() != null ? pp.getGlobalStock() : 0)
                        : (p.getMerchantStock() != null ? p.getMerchantStock() : 0));
                item.put("salesCount", p.getSalesCount());
            } else {
                ProductTranslation t = translationMap.get(p.getId());
                item.put("title", t != null && t.getTitle() != null ? t.getTitle() : p.getTitle());
                item.put("description", t != null && t.getDescription() != null ? t.getDescription() : p.getDescription());
                item.put("coverImage", p.getCoverImage());
                item.put("price", p.getPrice());
                item.put("originalPrice", p.getOriginalPrice());
                item.put("stock", p.getStock());
                item.put("salesCount", p.getSalesCount());
            }
            result.add(item);
        }
        return result;
    }

    public Map<String, Object> getProductDetail(Long id, String countryCode, String languageCode) {
        Product product = productMapper.selectById(id);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())) {
            return null;
        }
        Map<String, Object> detail = new HashMap<>();
        detail.put("id", product.getId());
        detail.put("merchantId", product.getMerchantId());
        detail.put("categoryId", product.getCategoryId());

        PlatformProduct pp = null;
        List<PlatformProductImage> ppImages = null;
        List<PlatformProductTranslation> ppTranslations = null;
        if (product.getPlatformProductId() != null) {
            pp = platformProductMapper.selectById(product.getPlatformProductId());
            if (pp != null && Boolean.TRUE.equals(pp.getDeleted())) pp = null;
            if (pp != null) {
                ppImages = platformProductImageMapper.selectList(
                        Wrappers.<PlatformProductImage>lambdaQuery()
                                .eq(PlatformProductImage::getPlatformProductId, pp.getId())
                                .orderByAsc(PlatformProductImage::getSort));

                LambdaQueryWrapper<PlatformProductTranslation> ptw = Wrappers.<PlatformProductTranslation>lambdaQuery()
                        .eq(PlatformProductTranslation::getPlatformProductId, pp.getId());
                if (countryCode != null && !countryCode.isBlank()) {
                    ptw.eq(PlatformProductTranslation::getCountryCode, countryCode);
                }
                if (languageCode != null && !languageCode.isBlank()) {
                    ptw.eq(PlatformProductTranslation::getLanguageCode, languageCode);
                }
                ppTranslations = platformProductTranslationMapper.selectList(ptw);
            }
        }

        if (pp != null) {
            detail.put("title", pp.getName());
            detail.put("description", null);
            detail.put("coverImage", ppImages != null && !ppImages.isEmpty() ? ppImages.get(0).getUrl() : null);
            detail.put("price", pp.getSalePrice());
            detail.put("originalPrice", pp.getOriginalPrice());
            detail.put("stock", "PLATFORM_GLOBAL".equals(pp.getStockMode())
                    ? (pp.getGlobalStock() != null ? pp.getGlobalStock() : 0)
                    : (product.getMerchantStock() != null ? product.getMerchantStock() : 0));
            detail.put("brand", pp.getBrand());
            detail.put("model", pp.getModel());
            detail.put("stockMode", pp.getStockMode());
            detail.put("merchantPrice", pp.getMerchantPrice());
            detail.put("profitAmount", pp.getProfitAmount());
            detail.put("profitRate", pp.getProfitRate());

            if (ppImages != null) {
                List<Map<String, Object>> imageList = new ArrayList<>();
                for (PlatformProductImage img : ppImages) {
                    Map<String, Object> imgMap = new HashMap<>();
                    imgMap.put("id", img.getId());
                    imgMap.put("url", img.getUrl());
                    imgMap.put("sort", img.getSort());
                    imageList.add(imgMap);
                }
                detail.put("images", imageList);
            }
            if (ppTranslations != null) {
                detail.put("translations", ppTranslations);
                if (!ppTranslations.isEmpty() && ppTranslations.get(0).getName() != null) {
                    detail.put("title", ppTranslations.get(0).getName());
                }
                if (!ppTranslations.isEmpty() && ppTranslations.get(0).getDescription() != null) {
                    detail.put("description", ppTranslations.get(0).getDescription());
                }
            }
        } else {
            detail.put("title", product.getTitle());
            detail.put("description", product.getDescription());
            detail.put("coverImage", product.getCoverImage());
            detail.put("price", product.getPrice());
            detail.put("originalPrice", product.getOriginalPrice());
            detail.put("stock", product.getStock());

            LambdaQueryWrapper<ProductImage> iw = Wrappers.<ProductImage>lambdaQuery()
                    .eq(ProductImage::getProductId, id)
                    .orderByAsc(ProductImage::getSort);
            detail.put("images", productImageMapper.selectList(iw));

            LambdaQueryWrapper<ProductTranslation> tw = Wrappers.<ProductTranslation>lambdaQuery()
                    .eq(ProductTranslation::getProductId, id);
            if (countryCode != null && !countryCode.isBlank()) {
                tw.eq(ProductTranslation::getCountryCode, countryCode);
            }
            if (languageCode != null && !languageCode.isBlank()) {
                tw.eq(ProductTranslation::getLanguageCode, languageCode);
            }
            List<ProductTranslation> translations = productTranslationMapper.selectList(tw);
            detail.put("translations", translations);

            if (translations.size() > 0 && translations.get(0).getTitle() != null) {
                detail.put("title", translations.get(0).getTitle());
            }
            if (translations.size() > 0 && translations.get(0).getDescription() != null) {
                detail.put("description", translations.get(0).getDescription());
            }
        }

        detail.put("salesCount", product.getSalesCount());
        detail.put("status", product.getStatus());
        detail.put("listingStatus", product.getListingStatus());
        detail.put("platformProductId", product.getPlatformProductId());
        detail.put("auditStatus", product.getAuditStatus());
        detail.put("createdAt", product.getCreatedAt());

        Category category = categoryMapper.selectById(product.getCategoryId());
        if (category != null) {
            Map<String, Object> catMap = new HashMap<>();
            catMap.put("id", category.getId());
            catMap.put("name", category.getName());
            LambdaQueryWrapper<CategoryTranslation> ctw = Wrappers.<CategoryTranslation>lambdaQuery()
                    .eq(CategoryTranslation::getCategoryId, category.getId());
            if (countryCode != null && !countryCode.isBlank()) {
                ctw.eq(CategoryTranslation::getCountryCode, countryCode);
            }
            if (languageCode != null && !languageCode.isBlank()) {
                ctw.eq(CategoryTranslation::getLanguageCode, languageCode);
            }
            List<CategoryTranslation> ctList = categoryTranslationMapper.selectList(ctw);
            if (ctList.size() > 0) {
                catMap.put("name", ctList.get(0).getName());
            }
            detail.put("category", catMap);
        }

        if (product.getMerchantId() != null) {
            Merchant merchant = merchantMapper.selectById(product.getMerchantId());
            if (merchant != null) {
                Map<String, Object> m = new HashMap<>();
                m.put("id", merchant.getId());
                m.put("nickname", merchant.getShopName());
                m.put("avatar", merchant.getShopLogo());
                m.put("shopName", merchant.getShopName());
                m.put("shopLogo", merchant.getShopLogo());
                detail.put("merchant", m);
            }
        }
        return detail;
    }

    public List<Product> getRecommendedProducts() {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getDeleted, false)
                .eq(Product::getStatus, "ON_SALE")
                .eq(Product::getAuditStatus, "APPROVED")
                .orderByDesc(Product::getSalesCount)
                .last("LIMIT 20");
        return productMapper.selectList(wrapper);
    }

    public List<Product> getHotProducts() {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getDeleted, false)
                .eq(Product::getStatus, "ON_SALE")
                .eq(Product::getAuditStatus, "APPROVED")
                .orderByDesc(Product::getSalesCount)
                .last("LIMIT 10");
        return productMapper.selectList(wrapper);
    }

    @Transactional
    public Product createProduct(Product product) {
        productMapper.insert(product);
        return product;
    }

    @Transactional
    public Product updateProduct(Long id, Product product) {
        product.setId(id);
        productMapper.updateById(product);
        return productMapper.selectById(id);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productMapper.selectById(id);
        if (product != null) {
            product.setDeleted(true);
            productMapper.updateById(product);
        }
    }

    @Transactional
    public void submitAudit(Long id) {
        Product product = productMapper.selectById(id);
        if (product != null) {
            product.setAuditStatus("PENDING");
            productMapper.updateById(product);
        }
    }

    @Transactional
    public void saveImages(Long productId, List<String> imageUrls) {
        LambdaQueryWrapper<ProductImage> wrapper = Wrappers.<ProductImage>lambdaQuery()
                .eq(ProductImage::getProductId, productId);
        productImageMapper.delete(wrapper);
        if (imageUrls != null) {
            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImage img = new ProductImage();
                img.setProductId(productId);
                img.setImageUrl(imageUrls.get(i));
                img.setSort(i);
                img.setIsMain(i == 0);
                img.setCreatedAt(java.time.LocalDateTime.now());
                productImageMapper.insert(img);
            }
        }
    }

    @Transactional
    public void saveTranslations(Long productId, List<Map<String, String>> translations) {
        LambdaQueryWrapper<ProductTranslation> wrapper = Wrappers.<ProductTranslation>lambdaQuery()
                .eq(ProductTranslation::getProductId, productId);
        productTranslationMapper.delete(wrapper);
        if (translations != null) {
            for (Map<String, String> t : translations) {
                ProductTranslation pt = new ProductTranslation();
                pt.setProductId(productId);
                pt.setLanguageCode(t.get("languageCode"));
                pt.setCountryCode(t.get("countryCode"));
                pt.setTitle(t.get("title"));
                pt.setDescription(t.get("description"));
                pt.setCreatedAt(java.time.LocalDateTime.now());
                pt.setUpdatedAt(java.time.LocalDateTime.now());
                productTranslationMapper.insert(pt);
            }
        }
    }

    public Page<Product> getMerchantProducts(Long merchantId, String keyword, String status, String auditStatus,
                                              int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getMerchantId, merchantId)
                .eq(Product::getDeleted, false);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(Product::getTitle, keyword);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(Product::getStatus, status);
        }
        if (auditStatus != null && !auditStatus.isBlank()) {
            wrapper.eq(Product::getAuditStatus, auditStatus);
        }
        wrapper.orderByDesc(Product::getCreatedAt);
        return productMapper.selectPage(new Page<>(page, pageSize), wrapper);
    }

    public Page<Product> getAllProducts(String keyword, Long categoryId, Long merchantId,
                                         String status, String auditStatus, int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getDeleted, false);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(Product::getTitle, keyword);
        }
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (merchantId != null) {
            wrapper.eq(Product::getMerchantId, merchantId);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(Product::getStatus, status);
        }
        if (auditStatus != null && !auditStatus.isBlank()) {
            wrapper.eq(Product::getAuditStatus, auditStatus);
        }
        wrapper.orderByDesc(Product::getCreatedAt);
        return productMapper.selectPage(new Page<>(page, pageSize), wrapper);
    }

    public Page<Product> getPendingAuditProducts(int page, int pageSize) {
        LambdaQueryWrapper<Product> wrapper = Wrappers.<Product>lambdaQuery()
                .eq(Product::getDeleted, false)
                .eq(Product::getAuditStatus, "PENDING")
                .orderByAsc(Product::getCreatedAt);
        return productMapper.selectPage(new Page<>(page, pageSize), wrapper);
    }

    @Transactional
    public void updateProductStatus(Long id, String status) {
        Product product = productMapper.selectById(id);
        if (product != null) {
            product.setStatus(status);
            productMapper.updateById(product);
        }
    }

    @Transactional
    public void auditProduct(Long id, String auditStatus, String auditRemark, Long auditBy) {
        Product product = productMapper.selectById(id);
        if (product != null) {
            product.setAuditStatus(auditStatus);
            product.setAuditRemark(auditRemark);
            product.setAuditBy(auditBy);
            product.setAuditAt(java.time.LocalDateTime.now());
            if ("APPROVED".equals(auditStatus)) {
                product.setStatus("ON_SALE");
            }
            productMapper.updateById(product);
        }
    }
}
