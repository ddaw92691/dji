package com.mall.api.modules.cart;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.cart.entity.CartItem;
import com.mall.api.modules.cart.mapper.CartItemMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.entity.ProductTranslation;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.product.mapper.ProductTranslationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final ProductTranslationMapper productTranslationMapper;

    public CartService(CartItemMapper cartItemMapper, ProductMapper productMapper,
                       ProductTranslationMapper productTranslationMapper) {
        this.cartItemMapper = cartItemMapper;
        this.productMapper = productMapper;
        this.productTranslationMapper = productTranslationMapper;
    }

    public List<Map<String, Object>> getCart(Long userId, String countryCode, String languageCode) {
        LambdaQueryWrapper<CartItem> wrapper = Wrappers.<CartItem>lambdaQuery()
                .eq(CartItem::getUserId, userId)
                .orderByDesc(CartItem::getCreatedAt);
        List<CartItem> items = cartItemMapper.selectList(wrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        for (CartItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("productId", item.getProductId());
            map.put("quantity", item.getQuantity());
            map.put("priceSnapshot", item.getPriceSnapshot());
            map.put("selected", item.getSelected());
            map.put("createdAt", item.getCreatedAt());
            if (product != null) {
                String title = product.getTitle();
                LambdaQueryWrapper<ProductTranslation> tw = Wrappers.<ProductTranslation>lambdaQuery()
                        .eq(ProductTranslation::getProductId, product.getId());
                if (countryCode != null && !countryCode.isBlank()) {
                    tw.eq(ProductTranslation::getCountryCode, countryCode);
                }
                if (languageCode != null && !languageCode.isBlank()) {
                    tw.eq(ProductTranslation::getLanguageCode, languageCode);
                }
                List<ProductTranslation> translations = productTranslationMapper.selectList(tw);
                if (!translations.isEmpty() && translations.get(0).getTitle() != null) {
                    title = translations.get(0).getTitle();
                }
                map.put("title", title);
                map.put("coverImage", product.getCoverImage());
                map.put("price", product.getPrice());
                map.put("stock", product.getStock());
                map.put("available", "ON_SALE".equals(product.getStatus())
                        && "APPROVED".equals(product.getAuditStatus())
                        && !Boolean.TRUE.equals(product.getDeleted())
                        && product.getStock() > 0);
            }
            result.add(map);
        }
        return result;
    }

    @Transactional
    public CartItem addItem(Long userId, Long productId, Integer quantity) {
        Product product = productMapper.selectById(productId);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())) {
            throw new BusinessException(400, "商品不存在");
        }
        if (!"APPROVED".equals(product.getAuditStatus())) {
            throw new BusinessException(400, "商品未通过审核");
        }
        if (!"ON_SALE".equals(product.getStatus())) {
            throw new BusinessException(400, "商品已下架");
        }
        if (product.getStock() <= 0) {
            throw new BusinessException(400, "商品库存不足");
        }

        LambdaQueryWrapper<CartItem> wrapper = Wrappers.<CartItem>lambdaQuery()
                .eq(CartItem::getUserId, userId)
                .eq(CartItem::getProductId, productId);
        CartItem existing = cartItemMapper.selectOne(wrapper);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            existing.setUpdatedAt(LocalDateTime.now());
            cartItemMapper.updateById(existing);
            return existing;
        }

        CartItem item = new CartItem();
        item.setUserId(userId);
        item.setProductId(productId);
        item.setQuantity(quantity);
        item.setPriceSnapshot(product.getPrice());
        item.setSelected(true);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        cartItemMapper.insert(item);
        return item;
    }

    @Transactional
    public void updateItem(Long userId, Long cartItemId, Integer quantity, Boolean selected) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new BusinessException(400, "error.cart.itemNotFound");
        }
        if (quantity != null) {
            item.setQuantity(quantity);
        }
        if (selected != null) {
            item.setSelected(selected);
        }
        item.setUpdatedAt(LocalDateTime.now());
        cartItemMapper.updateById(item);
    }

    @Transactional
    public void deleteItem(Long userId, Long cartItemId) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new BusinessException(400, "error.cart.itemNotFound");
        }
        cartItemMapper.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        LambdaQueryWrapper<CartItem> wrapper = Wrappers.<CartItem>lambdaQuery()
                .eq(CartItem::getUserId, userId);
        cartItemMapper.delete(wrapper);
    }

    @Transactional
    public void selectAll(Long userId, Boolean selected) {
        LambdaQueryWrapper<CartItem> wrapper = Wrappers.<CartItem>lambdaQuery()
                .eq(CartItem::getUserId, userId);
        List<CartItem> items = cartItemMapper.selectList(wrapper);
        LocalDateTime now = LocalDateTime.now();
        for (CartItem item : items) {
            item.setSelected(selected);
            item.setUpdatedAt(now);
            cartItemMapper.updateById(item);
        }
    }
}
