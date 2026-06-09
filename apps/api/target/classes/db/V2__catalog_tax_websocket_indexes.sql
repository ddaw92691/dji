-- Platform Product Catalog Indexes
CREATE INDEX IF NOT EXISTS idx_platform_product_deleted ON platform_product(deleted);
CREATE INDEX IF NOT EXISTS idx_platform_product_status ON platform_product(status);
CREATE INDEX IF NOT EXISTS idx_platform_product_category_id ON platform_product(category_id);
CREATE INDEX IF NOT EXISTS idx_platform_product_brand ON platform_product(brand);

CREATE INDEX IF NOT EXISTS idx_platform_product_image_ppid ON platform_product_image(platform_product_id);
CREATE INDEX IF NOT EXISTS idx_platform_product_image_sort ON platform_product_image(platform_product_id, sort);

CREATE INDEX IF NOT EXISTS idx_platform_product_trans_ppid ON platform_product_translation(platform_product_id);
CREATE INDEX IF NOT EXISTS idx_platform_product_trans_lang ON platform_product_translation(language_code, country_code);

-- Product listing index (platform_product_id lookup)
CREATE INDEX IF NOT EXISTS idx_product_platform_product_id ON product(platform_product_id);
CREATE INDEX IF NOT EXISTS idx_product_listing_status ON product(listing_status);
CREATE INDEX IF NOT EXISTS idx_product_merchant_platform ON product(merchant_id, platform_product_id);

-- Merchant Tax Notice Indexes
CREATE INDEX IF NOT EXISTS idx_merchant_tax_notice_merchant ON merchant_tax_notice(merchant_id, deleted);
CREATE INDEX IF NOT EXISTS idx_merchant_tax_notice_status ON merchant_tax_notice(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_merchant_tax_notice_popup ON merchant_tax_notice(merchant_id, force_popup, status);
CREATE INDEX IF NOT EXISTS idx_merchant_tax_notice_user ON merchant_tax_notice(merchant_user_id);

-- Mall Order new field indexes
CREATE INDEX IF NOT EXISTS idx_mall_order_order_source ON mall_order(order_source);
CREATE INDEX IF NOT EXISTS idx_mall_order_created_by_admin ON mall_order(created_by_admin);
CREATE INDEX IF NOT EXISTS idx_mall_order_virtual_customer ON mall_order(virtual_customer_id);

-- Sys User new field indexes
CREATE INDEX IF NOT EXISTS idx_sys_user_is_virtual ON sys_user(is_virtual);
CREATE INDEX IF NOT EXISTS idx_sys_user_created_by_admin ON sys_user(created_by_admin);
