package com.mall.api.modules.review.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("product_review")
public class ProductReview implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("order_id")
    private Long orderId;

    @TableField("order_item_id")
    private Long orderItemId;

    @TableField("product_id")
    private Long productId;

    @TableField("user_id")
    private Long userId;

    @TableField("merchant_id")
    private Long merchantId;

    private Integer rating;
    private String content;
    private String images;
    private String status;

    @TableField("reply_content")
    private String replyContent;

    @TableField("replied_at")
    private LocalDateTime repliedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean deleted;
}
