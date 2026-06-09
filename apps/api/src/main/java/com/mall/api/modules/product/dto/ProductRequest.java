package com.mall.api.modules.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductRequest {

    private Long categoryId;
    private String title;
    private String description;
    private String coverImage;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private List<String> images;
    private List<Map<String, String>> translations;
}
