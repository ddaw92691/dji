-- ============================================
-- Mall System Complete Database Schema
-- PostgreSQL 16
-- ============================================

-- 1. System User
CREATE TABLE IF NOT EXISTS sys_user (
    id              BIGINT          PRIMARY KEY,
    username        VARCHAR(100)    NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    email           VARCHAR(100),
    phone           VARCHAR(50),
    nickname        VARCHAR(100),
    avatar          VARCHAR(500),
    role            VARCHAR(50)     NOT NULL DEFAULT 'CUSTOMER',
    status          INTEGER         NOT NULL DEFAULT 1,
    country_code    VARCHAR(10)     DEFAULT 'US',
    language_code   VARCHAR(10)     DEFAULT 'en',
    invite_code     VARCHAR(50),
    invited_by      BIGINT,
    last_login_at   TIMESTAMP,
    last_login_ip   VARCHAR(50),
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_user_username ON sys_user(username);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_user_email ON sys_user(email) WHERE email IS NOT NULL AND email != '';
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_user_phone ON sys_user(phone) WHERE phone IS NOT NULL AND phone != '';
CREATE INDEX IF NOT EXISTS idx_sys_user_role ON sys_user(role);
CREATE INDEX IF NOT EXISTS idx_sys_user_status ON sys_user(status);

-- 2. System Role
CREATE TABLE IF NOT EXISTS sys_role (
    id              BIGINT          PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_role_code ON sys_role(code);

-- 3. System Menu
CREATE TABLE IF NOT EXISTS sys_menu (
    id              BIGINT          PRIMARY KEY,
    parent_id       BIGINT,
    app_type        VARCHAR(20)     NOT NULL DEFAULT 'ADMIN',
    type            VARCHAR(20)     NOT NULL DEFAULT 'menu',
    path            VARCHAR(200),
    component       VARCHAR(200),
    title           VARCHAR(100)    NOT NULL,
    icon            VARCHAR(100),
    permission      VARCHAR(200),
    sort            INTEGER         NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    visible         BOOLEAN         NOT NULL DEFAULT TRUE,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sys_menu_parent ON sys_menu(parent_id);

-- 4. User-Role relation
CREATE TABLE IF NOT EXISTS sys_user_role (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    role_id         BIGINT          NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_user_role ON sys_user_role(user_id, role_id);

-- 5. Role-Menu relation
CREATE TABLE IF NOT EXISTS sys_role_menu (
    id              BIGINT          PRIMARY KEY,
    role_id         BIGINT          NOT NULL,
    menu_id         BIGINT          NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sys_role_menu ON sys_role_menu(role_id, menu_id);

-- 6. Customer Profile
CREATE TABLE IF NOT EXISTS customer_profile (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    invite_code     VARCHAR(50),
    invited_by      BIGINT,
    agent_id        BIGINT,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_customer_profile_user ON customer_profile(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_customer_invite_code ON customer_profile(invite_code) WHERE invite_code IS NOT NULL;

-- 7. Merchant
CREATE TABLE IF NOT EXISTS merchant (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    shop_name       VARCHAR(200),
    shop_logo       VARCHAR(500),
    shop_desc       TEXT,
    balance         NUMERIC(18,2)   NOT NULL DEFAULT 0,
    frozen_balance  NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_sales     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_withdrawn NUMERIC(18,2)   NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_merchant_user ON merchant(user_id);

-- 商家独立提现密码（与登录密码分离）
ALTER TABLE merchant ADD COLUMN IF NOT EXISTS withdraw_password VARCHAR(255);

-- 商家资金流水
CREATE TABLE IF NOT EXISTS merchant_fund_log (
    id              BIGINT          PRIMARY KEY,
    merchant_id     BIGINT          NOT NULL,
    type            VARCHAR(40)     NOT NULL,
    amount          NUMERIC(18,2)   NOT NULL,
    balance_before  NUMERIC(18,2),
    balance_after   NUMERIC(18,2),
    frozen_balance_before NUMERIC(18,2),
    frozen_balance_after  NUMERIC(18,2),
    operator_type   VARCHAR(20),
    reason          VARCHAR(500),
    related_order_id BIGINT,
    related_recharge_id BIGINT,
    ref_type        VARCHAR(50),
    ref_id          BIGINT,
    remark          VARCHAR(500),
    operator_id     BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_merchant_fund_log_merchant ON merchant_fund_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_fund_log_created ON merchant_fund_log(created_at);

CREATE TABLE IF NOT EXISTS merchant_fund_reconciliation (
    id                         BIGINT          PRIMARY KEY,
    reconcile_date             DATE            NOT NULL,
    merchant_id                BIGINT          NOT NULL,
    opening_balance            NUMERIC(18,2)   NOT NULL DEFAULT 0,
    inflow_amount              NUMERIC(18,2)   NOT NULL DEFAULT 0,
    outflow_amount             NUMERIC(18,2)   NOT NULL DEFAULT 0,
    expected_closing_balance   NUMERIC(18,2)   NOT NULL DEFAULT 0,
    ledger_closing_balance     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    actual_balance             NUMERIC(18,2)   NOT NULL DEFAULT 0,
    balance_difference         NUMERIC(18,2)   NOT NULL DEFAULT 0,
    opening_frozen_balance     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    frozen_inflow_amount       NUMERIC(18,2)   NOT NULL DEFAULT 0,
    frozen_outflow_amount      NUMERIC(18,2)   NOT NULL DEFAULT 0,
    expected_closing_frozen    NUMERIC(18,2)   NOT NULL DEFAULT 0,
    ledger_closing_frozen      NUMERIC(18,2)   NOT NULL DEFAULT 0,
    actual_frozen_balance      NUMERIC(18,2)   NOT NULL DEFAULT 0,
    frozen_difference          NUMERIC(18,2)   NOT NULL DEFAULT 0,
    opening_total_balance      NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_inflow_amount        NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_outflow_amount       NUMERIC(18,2)   NOT NULL DEFAULT 0,
    expected_closing_total     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    ledger_closing_total       NUMERIC(18,2)   NOT NULL DEFAULT 0,
    actual_total_balance       NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_difference           NUMERIC(18,2)   NOT NULL DEFAULT 0,
    log_count                  INTEGER         NOT NULL DEFAULT 0,
    issue_count                INTEGER         NOT NULL DEFAULT 0,
    status                     VARCHAR(20)     NOT NULL DEFAULT 'OK',
    issue_summary              VARCHAR(1000),
    checked_at                 TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at                 TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                 TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_merchant_fund_reconciliation_date_merchant ON merchant_fund_reconciliation(reconcile_date, merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_fund_reconciliation_date ON merchant_fund_reconciliation(reconcile_date);
CREATE INDEX IF NOT EXISTS idx_merchant_fund_reconciliation_status ON merchant_fund_reconciliation(status);

-- 提款账户（加密货币 / 银行）
CREATE TABLE IF NOT EXISTS withdraw_account (
    id              BIGINT          PRIMARY KEY,
    merchant_id     BIGINT          NOT NULL,
    user_id         BIGINT,
    type            VARCHAR(20)     NOT NULL,
    chain           VARCHAR(50),
    address         VARCHAR(255),
    bank_name       VARCHAR(200),
    account_no      VARCHAR(100),
    account_name    VARCHAR(100),
    swift_code      VARCHAR(50),
    country         VARCHAR(100),
    remark          VARCHAR(500),
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_withdraw_account_merchant ON withdraw_account(merchant_id);

-- 商家充值订单
CREATE TABLE IF NOT EXISTS recharge_order (
    id              BIGINT          PRIMARY KEY,
    recharge_no     VARCHAR(50)     NOT NULL,
    merchant_id     BIGINT          NOT NULL,
    user_id         BIGINT,
    amount          NUMERIC(18,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'JPY',
    method          VARCHAR(50),
    proof_url       VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    remark          VARCHAR(500),
    reject_reason   VARCHAR(500),
    reviewed_by     BIGINT,
    reviewed_at     TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_recharge_no ON recharge_order(recharge_no);
CREATE INDEX IF NOT EXISTS idx_recharge_merchant ON recharge_order(merchant_id);
CREATE INDEX IF NOT EXISTS idx_recharge_status ON recharge_order(status);

-- Merchant Application
CREATE TABLE IF NOT EXISTS merchant_application (
    id                          BIGINT          PRIMARY KEY,
    email                       VARCHAR(100)    NOT NULL,
    phone                       VARCHAR(50)     NOT NULL,
    password_hash               VARCHAR(255)    NOT NULL,
    full_name                   VARCHAR(100)    NOT NULL,
    age                         INTEGER         NOT NULL,
    home_address                VARCHAR(500)    NOT NULL,
    document_type               VARCHAR(30)     NOT NULL DEFAULT 'id_card',
    id_card_front_url           VARCHAR(500),
    id_card_back_url            VARCHAR(500),
    passport_page_url           VARCHAR(500),
    driver_license_url          VARCHAR(500),
    handheld_document_video_url VARCHAR(500)    NOT NULL,
    status                      VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    review_remark               VARCHAR(500),
    reviewed_by                 BIGINT,
    reviewed_at                 TIMESTAMP,
    user_id                     BIGINT,
    merchant_id                 BIGINT,
    deleted                     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_merchant_application_email ON merchant_application(email);
CREATE INDEX IF NOT EXISTS idx_merchant_application_status ON merchant_application(status);
CREATE INDEX IF NOT EXISTS idx_merchant_application_merchant ON merchant_application(merchant_id);

-- 8. Agent
CREATE TABLE IF NOT EXISTS agent (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    invite_code     VARCHAR(50),
    parent_agent_id BIGINT,
    level           INTEGER         NOT NULL DEFAULT 0,
    commission_rate NUMERIC(10,4)   NOT NULL DEFAULT 0,
    balance         NUMERIC(18,2)   NOT NULL DEFAULT 0,
    frozen_balance  NUMERIC(18,2)   NOT NULL DEFAULT 0,
    total_commission NUMERIC(18,2)  NOT NULL DEFAULT 0,
    total_withdrawn  NUMERIC(18,2)  NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_agent_user ON agent(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_agent_invite_code ON agent(invite_code) WHERE invite_code IS NOT NULL;

-- 9. Category
CREATE TABLE IF NOT EXISTS category (
    id              BIGINT          PRIMARY KEY,
    parent_id       BIGINT,
    name            VARCHAR(200)    NOT NULL,
    icon            VARCHAR(500),
    image           VARCHAR(500),
    sort            INTEGER         NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_category_parent ON category(parent_id);

-- 10. Category Translation
CREATE TABLE IF NOT EXISTS category_translation (
    id              BIGINT          PRIMARY KEY,
    category_id     BIGINT          NOT NULL,
    language_code   VARCHAR(10)     NOT NULL,
    country_code    VARCHAR(10),
    name            VARCHAR(200)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_category_trans ON category_translation(category_id, language_code, COALESCE(country_code, ''));

-- 11. Product
CREATE TABLE IF NOT EXISTS product (
    id              BIGINT          PRIMARY KEY,
    merchant_id     BIGINT          NOT NULL,
    category_id     BIGINT,
    title           VARCHAR(500)    NOT NULL,
    description     TEXT,
    price           NUMERIC(18,2)   NOT NULL,
    original_price  NUMERIC(18,2),
    stock           INTEGER         NOT NULL DEFAULT 0,
    sales           INTEGER         NOT NULL DEFAULT 0,
    main_image      VARCHAR(500),
    audit_by        BIGINT,
    audit_at        TIMESTAMP,
    status          VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    audit_status    VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    audit_remark    VARCHAR(500),
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_product_merchant ON product(merchant_id);
CREATE INDEX IF NOT EXISTS idx_product_category ON product(category_id);
CREATE INDEX IF NOT EXISTS idx_product_status ON product(status);

-- 12. Product Image
CREATE TABLE IF NOT EXISTS product_image (
    id              BIGINT          PRIMARY KEY,
    product_id      BIGINT          NOT NULL,
    image_url       VARCHAR(500)    NOT NULL,
    sort            INTEGER         NOT NULL DEFAULT 0,
    is_main         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_product_image_pid ON product_image(product_id);

-- 13. Product Translation
CREATE TABLE IF NOT EXISTS product_translation (
    id              BIGINT          PRIMARY KEY,
    product_id      BIGINT          NOT NULL,
    language_code   VARCHAR(10)     NOT NULL,
    country_code    VARCHAR(10),
    title           VARCHAR(500),
    description     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_product_trans ON product_translation(product_id, language_code, COALESCE(country_code, ''));

-- 14. Cart Item
CREATE TABLE IF NOT EXISTS cart_item (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    quantity        INTEGER         NOT NULL DEFAULT 1,
    price_snapshot  NUMERIC(18,2),
    selected        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_cart_user_product ON cart_item(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_user ON cart_item(user_id);

-- 15. Address
CREATE TABLE IF NOT EXISTS address (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    receiver_name   VARCHAR(100)    NOT NULL,
    receiver_phone  VARCHAR(50)     NOT NULL,
    country         VARCHAR(100),
    province        VARCHAR(100),
    city            VARCHAR(100),
    district        VARCHAR(100),
    detail          VARCHAR(500),
    postal_code     VARCHAR(20),
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_address_user ON address(user_id);

-- 16. Mall Order
CREATE TABLE IF NOT EXISTS mall_order (
    id              BIGINT          PRIMARY KEY,
    order_no        VARCHAR(50)     NOT NULL,
    user_id         BIGINT          NOT NULL,
    merchant_id     BIGINT,
    total_amount    NUMERIC(18,2)   NOT NULL,
    discount_amount NUMERIC(18,2)   NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(18,2)   NOT NULL DEFAULT 0,
    pay_amount      NUMERIC(18,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'JPY',
    status          VARCHAR(30)     NOT NULL DEFAULT 'PENDING_PAYMENT',
    pay_status      VARCHAR(30)     NOT NULL DEFAULT 'UNPAID',
    address_snapshot TEXT,
    logistics_company VARCHAR(100),
    tracking_no     VARCHAR(100),
    paid_at         TIMESTAMP,
    shipped_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    cancelled_at    TIMESTAMP,
    receiver_name   VARCHAR(100),
    receiver_phone  VARCHAR(50),
    receiver_address TEXT,
    remark          VARCHAR(500),
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_order_no ON mall_order(order_no);
CREATE INDEX IF NOT EXISTS idx_order_user ON mall_order(user_id);
CREATE INDEX IF NOT EXISTS idx_order_merchant ON mall_order(merchant_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON mall_order(status);

-- 17. Order Item
CREATE TABLE IF NOT EXISTS order_item (
    id              BIGINT          PRIMARY KEY,
    order_id        BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    product_title   VARCHAR(500)    NOT NULL,
    product_image   VARCHAR(500),
    price           NUMERIC(18,2)   NOT NULL,
    quantity        INTEGER         NOT NULL,
    total_amount    NUMERIC(18,2)   NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_item_order ON order_item(order_id);

-- 18. Payment
CREATE TABLE IF NOT EXISTS payment (
    id              BIGINT          PRIMARY KEY,
    payment_no      VARCHAR(50)     NOT NULL,
    order_id        BIGINT          NOT NULL,
    user_id         BIGINT          NOT NULL,
    amount          NUMERIC(18,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'JPY',
    method          VARCHAR(50)     NOT NULL DEFAULT 'SIMULATED',
    status          VARCHAR(30)     NOT NULL DEFAULT 'UNPAID',
    transaction_no  VARCHAR(100),
    paid_at         TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_payment_no ON payment(payment_no);
CREATE INDEX IF NOT EXISTS idx_payment_order ON payment(order_id);

-- 19. Commission
CREATE TABLE IF NOT EXISTS commission (
    id              BIGINT          PRIMARY KEY,
    agent_id        BIGINT          NOT NULL,
    order_id        BIGINT          NOT NULL,
    order_no        VARCHAR(50),
    user_id         BIGINT,
    buyer_user_id   BIGINT,
    order_item_id   BIGINT,
    amount          NUMERIC(18,2)   NOT NULL,
    rate            NUMERIC(10,4)   NOT NULL,
    status          VARCHAR(30)     NOT NULL DEFAULT 'FROZEN',
    settled_at      TIMESTAMP,
    cancelled_at    TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_commission_agent ON commission(agent_id);
CREATE INDEX IF NOT EXISTS idx_commission_order ON commission(order_id);

-- 20. Withdrawal
CREATE TABLE IF NOT EXISTS withdrawal (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'MERCHANT',
    type            VARCHAR(30)     NOT NULL DEFAULT 'MERCHANT_BALANCE',
    user_type       VARCHAR(20)     NOT NULL DEFAULT 'MERCHANT',
    amount          NUMERIC(18,2)   NOT NULL,
    fee             NUMERIC(18,2)   NOT NULL DEFAULT 0,
    actual_amount   NUMERIC(18,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'JPY',
    bank_name       VARCHAR(200),
    bank_account    VARCHAR(100),
    account_name    VARCHAR(100),
    method          VARCHAR(50),
    account_info    VARCHAR(500),
    remark          VARCHAR(500),
    reject_reason   VARCHAR(500),
    status          VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    reviewed_by     BIGINT,
    reviewed_at     TIMESTAMP,
    audit_remark    VARCHAR(500),
    audited_by      BIGINT,
    audited_at      TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_withdrawal_user ON withdrawal(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal(status);

-- 21. Banner
CREATE TABLE IF NOT EXISTS banner (
    id              BIGINT          PRIMARY KEY,
    title           VARCHAR(200),
    subtitle        VARCHAR(500),
    image_url       VARCHAR(500)    NOT NULL,
    link_url        VARCHAR(500),
    link_type       VARCHAR(50)     DEFAULT 'PRODUCT',
    sort            INTEGER         NOT NULL DEFAULT 0,
    position        VARCHAR(50)     NOT NULL DEFAULT 'HOME_TOP',
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_banner_position ON banner(position);

-- 22. Banner Translation
CREATE TABLE IF NOT EXISTS banner_translation (
    id              BIGINT          PRIMARY KEY,
    banner_id       BIGINT          NOT NULL,
    language_code   VARCHAR(10)     NOT NULL,
    country_code    VARCHAR(10),
    title           VARCHAR(200),
    subtitle        VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_banner_trans ON banner_translation(banner_id, language_code, COALESCE(country_code, ''));

-- 23. Coupon
CREATE TABLE IF NOT EXISTS coupon (
    id              BIGINT          PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    code            VARCHAR(100)    NOT NULL,
    type            VARCHAR(20)     NOT NULL DEFAULT 'AMOUNT',
    amount          NUMERIC(18,2)   DEFAULT 0,
    discount_rate   NUMERIC(10,4)   DEFAULT 1,
    min_spend       NUMERIC(18,2)   DEFAULT 0,
    total_quantity  INTEGER         NOT NULL DEFAULT 0,
    received_quantity INTEGER       NOT NULL DEFAULT 0,
    used_quantity   INTEGER         NOT NULL DEFAULT 0,
    per_user_limit  INTEGER         DEFAULT 1,
    start_at        TIMESTAMP       NOT NULL,
    end_at          TIMESTAMP       NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_coupon_code ON coupon(code);

-- Coupon Translation
CREATE TABLE IF NOT EXISTS coupon_translation (
    id              BIGINT          PRIMARY KEY,
    coupon_id       BIGINT          NOT NULL,
    language_code   VARCHAR(10)     NOT NULL,
    country_code    VARCHAR(10),
    name            VARCHAR(200),
    description     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_coupon_trans ON coupon_translation(coupon_id, language_code, COALESCE(country_code, ''));

-- User Coupon
CREATE TABLE IF NOT EXISTS user_coupon (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    coupon_id       BIGINT          NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'UNUSED',
    received_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_at         TIMESTAMP,
    order_id        BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_coupon_user ON user_coupon(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupon_coupon ON user_coupon(coupon_id);

-- 24. System Setting
CREATE TABLE IF NOT EXISTS system_setting (
    id              BIGINT          PRIMARY KEY,
    setting_key     VARCHAR(100)    NOT NULL,
    setting_value   TEXT,
    description     VARCHAR(500),
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_setting_key ON system_setting(setting_key);

-- 25. Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT,
    username        VARCHAR(100),
    module          VARCHAR(100)    NOT NULL,
    action          VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    method          VARCHAR(10),
    request_uri     VARCHAR(500),
    request_params  TEXT,
    response_body   TEXT,
    ip              VARCHAR(50),
    user_agent      VARCHAR(500),
    execution_time  BIGINT,
    status          VARCHAR(20)     NOT NULL DEFAULT 'SUCCESS',
    error_message   TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_module ON audit_log(module);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- 26. Country
CREATE TABLE IF NOT EXISTS country (
    id              BIGINT          PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(10)     NOT NULL,
    flag_icon       VARCHAR(10),
    phone_code      VARCHAR(10),
    default_language_code VARCHAR(10),
    currency_code   VARCHAR(10),
    currency_symbol VARCHAR(10),
    timezone        VARCHAR(50),
    region          VARCHAR(32),
    exchange_rate   NUMERIC(10,4)   DEFAULT 1,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_country_code ON country(code);
ALTER TABLE country ADD COLUMN IF NOT EXISTS region VARCHAR(32);

-- 27. Language
CREATE TABLE IF NOT EXISTS language (
    id              BIGINT          PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    native_name     VARCHAR(100)    NOT NULL,
    code            VARCHAR(10)     NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_language_code ON language(code);

-- 28. Country-Language relation
CREATE TABLE IF NOT EXISTS country_language (
    id              BIGINT          PRIMARY KEY,
    country_id      BIGINT          NOT NULL,
    language_id     BIGINT          NOT NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_country_language ON country_language(country_id, language_id);

-- 29. I18n Namespace
CREATE TABLE IF NOT EXISTS i18n_namespace (
    id              BIGINT          PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(50)     NOT NULL,
    description     VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_i18n_ns_code ON i18n_namespace(code);

-- 30. I18n Translation
CREATE TABLE IF NOT EXISTS i18n_translation (
    id              BIGINT          PRIMARY KEY,
    namespace_code  VARCHAR(50)     NOT NULL,
    translation_key VARCHAR(200)    NOT NULL,
    language_code   VARCHAR(10)     NOT NULL,
    country_code    VARCHAR(10),
    text_value      TEXT            NOT NULL,
    description     VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_i18n_trans_ns ON i18n_translation(namespace_code);
CREATE INDEX IF NOT EXISTS idx_i18n_trans_lang ON i18n_translation(language_code);
CREATE INDEX IF NOT EXISTS idx_i18n_trans_country ON i18n_translation(country_code);
CREATE UNIQUE INDEX IF NOT EXISTS uk_i18n_trans_key ON i18n_translation(namespace_code, translation_key, language_code, COALESCE(country_code, ''));

-- ============================================
-- Alter statements for existing tables (Phase 8)
-- ============================================
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS coupon_id BIGINT;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS user_coupon_id BIGINT;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS coupon_amount NUMERIC(18,2) DEFAULT 0;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS refund_status VARCHAR(30) DEFAULT 'NONE';
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(18,2);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS refund_reason VARCHAR(500);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS refund_reject_reason VARCHAR(500);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP;

ALTER TABLE payment ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(18,2);
ALTER TABLE payment ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP;

-- ============================================
-- Phase 9 tables
-- ============================================

-- File Resource
CREATE TABLE IF NOT EXISTS file_resource (
    id              BIGINT          PRIMARY KEY,
    original_name   VARCHAR(500)    NOT NULL,
    file_name       VARCHAR(500)    NOT NULL,
    file_url        VARCHAR(500)    NOT NULL,
    file_path       VARCHAR(500)    NOT NULL,
    file_size       BIGINT          NOT NULL,
    mime_type       VARCHAR(100),
    extension       VARCHAR(20),
    biz_type        VARCHAR(50)     NOT NULL,
    uploader_id     BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE
);

-- Product Review
CREATE TABLE IF NOT EXISTS product_review (
    id              BIGINT          PRIMARY KEY,
    order_id        BIGINT          NOT NULL,
    order_item_id   BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    user_id         BIGINT          NOT NULL,
    merchant_id     BIGINT          NOT NULL,
    rating          INTEGER         NOT NULL,
    content         TEXT,
    images          TEXT,
    status          VARCHAR(20)     NOT NULL DEFAULT 'VISIBLE',
    reply_content   TEXT,
    replied_at      TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_review_product ON product_review(product_id);
CREATE INDEX IF NOT EXISTS idx_review_user ON product_review(user_id);
CREATE INDEX IF NOT EXISTS idx_review_merchant ON product_review(merchant_id);

-- Notification
CREATE TABLE IF NOT EXISTS notification (
    id              BIGINT          PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    role            VARCHAR(50),
    title           VARCHAR(200)    NOT NULL,
    content         TEXT,
    type            VARCHAR(50)     NOT NULL DEFAULT 'SYSTEM',
    biz_type        VARCHAR(50),
    biz_id          BIGINT,
    read_status     VARCHAR(20)     NOT NULL DEFAULT 'UNREAD',
    read_at         TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_notification_user ON notification(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_read ON notification(user_id, read_status);

-- ============================================
-- Phase 10: Support/Customer Service tables
-- ============================================

-- Support Session
CREATE TABLE IF NOT EXISTS support_session (
    id                      BIGINT          PRIMARY KEY,
    session_no              VARCHAR(50)     NOT NULL,
    session_type            VARCHAR(50)     NOT NULL,
    title                   VARCHAR(200)    NOT NULL,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'OPEN',
    priority                VARCHAR(20)     NOT NULL DEFAULT 'NORMAL',
    customer_user_id        BIGINT,
    merchant_id             BIGINT,
    merchant_user_id        BIGINT,
    admin_user_id           BIGINT,
    inspection_operator_id  BIGINT,
    inspection_customer_user_id BIGINT,
    related_product_id      BIGINT,
    related_order_id        BIGINT,
    last_message            TEXT,
    last_message_at         TIMESTAMP,
    unread_customer_count   INTEGER         NOT NULL DEFAULT 0,
    unread_merchant_count   INTEGER         NOT NULL DEFAULT 0,
    unread_admin_count      INTEGER         NOT NULL DEFAULT 0,
    first_response_at       TIMESTAMP,
    closed_at               TIMESTAMP,
    close_reason            VARCHAR(500),
    quality_score           INTEGER,
    quality_remark          VARCHAR(500),
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted                 BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_support_session_no ON support_session(session_no);
CREATE INDEX IF NOT EXISTS idx_support_session_merchant ON support_session(merchant_id);
CREATE INDEX IF NOT EXISTS idx_support_session_customer ON support_session(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_support_session_type ON support_session(session_type);

-- Support Message
CREATE TABLE IF NOT EXISTS support_message (
    id                  BIGINT          PRIMARY KEY,
    session_id          BIGINT          NOT NULL,
    sender_user_id      BIGINT,
    sender_role         VARCHAR(50)     NOT NULL,
    sender_display_name VARCHAR(200),
    sender_avatar       VARCHAR(500),
    sender_side         VARCHAR(20)     NOT NULL,
    content             TEXT,
    message_type        VARCHAR(20)     NOT NULL DEFAULT 'TEXT',
    attachments         TEXT,
    read_at             TIMESTAMP,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted             BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_support_msg_session ON support_message(session_id);

-- Support Read State
CREATE TABLE IF NOT EXISTS support_read_state (
    id                      BIGINT          PRIMARY KEY,
    session_id              BIGINT          NOT NULL,
    user_id                 BIGINT          NOT NULL,
    last_read_message_id    BIGINT,
    unread_count            INTEGER         NOT NULL DEFAULT 0,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_support_read ON support_read_state(session_id, user_id);

-- Support Quick Reply
CREATE TABLE IF NOT EXISTS support_quick_reply (
    id              BIGINT          PRIMARY KEY,
    owner_type      VARCHAR(20)     NOT NULL,
    owner_user_id   BIGINT,
    owner_role      VARCHAR(50),
    title           VARCHAR(200)    NOT NULL,
    content         TEXT            NOT NULL,
    language_code   VARCHAR(10)     DEFAULT 'en',
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE
);

-- Support Inspection Log
CREATE TABLE IF NOT EXISTS support_inspection_log (
    id                      BIGINT          PRIMARY KEY,
    session_id              BIGINT          NOT NULL,
    merchant_id             BIGINT          NOT NULL,
    operator_user_id        BIGINT          NOT NULL,
    fake_customer_name      VARCHAR(200),
    question                TEXT,
    first_response_seconds  BIGINT,
    quality_score           INTEGER,
    quality_remark          VARCHAR(500),
    status                  VARCHAR(20)     NOT NULL DEFAULT 'RUNNING',
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inspection_merchant ON support_inspection_log(merchant_id);

-- ============================================
-- Performance indexes
-- ============================================

-- Product
CREATE INDEX IF NOT EXISTS idx_product_sales ON product(sales);
CREATE INDEX IF NOT EXISTS idx_product_created ON product(created_at);
CREATE INDEX IF NOT EXISTS idx_product_audit_status ON product(audit_status);

-- Mall order
CREATE INDEX IF NOT EXISTS idx_order_refund_status ON mall_order(refund_status);
CREATE INDEX IF NOT EXISTS idx_order_paid_at ON mall_order(paid_at);
CREATE INDEX IF NOT EXISTS idx_order_created ON mall_order(created_at);

-- Order item
CREATE INDEX IF NOT EXISTS idx_order_item_product ON order_item(product_id);

-- Payment
CREATE INDEX IF NOT EXISTS idx_payment_user ON payment(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment(status);
CREATE INDEX IF NOT EXISTS idx_payment_created ON payment(created_at);

-- Commission
CREATE INDEX IF NOT EXISTS idx_commission_status ON commission(status);
CREATE INDEX IF NOT EXISTS idx_commission_created ON commission(created_at);

-- Withdrawal
CREATE INDEX IF NOT EXISTS idx_withdrawal_role ON withdrawal(role);
CREATE INDEX IF NOT EXISTS idx_withdrawal_created ON withdrawal(created_at);

-- Coupon
CREATE INDEX IF NOT EXISTS idx_coupon_status ON coupon(status);
CREATE INDEX IF NOT EXISTS idx_coupon_dates ON coupon(start_at, end_at);

-- User coupon
CREATE INDEX IF NOT EXISTS idx_user_coupon_status ON user_coupon(status);
CREATE INDEX IF NOT EXISTS idx_user_coupon_order ON user_coupon(order_id);

-- Product review
CREATE INDEX IF NOT EXISTS idx_review_status ON product_review(status);
CREATE INDEX IF NOT EXISTS idx_review_created ON product_review(created_at);

-- Notification
CREATE INDEX IF NOT EXISTS idx_notification_type ON notification(type);
CREATE INDEX IF NOT EXISTS idx_notification_created ON notification(created_at);

-- Support session
CREATE INDEX IF NOT EXISTS idx_support_session_status ON support_session(status);
CREATE INDEX IF NOT EXISTS idx_support_session_last_msg ON support_session(last_message_at);

-- Support message
CREATE INDEX IF NOT EXISTS idx_support_msg_created ON support_message(created_at);

-- Audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON audit_log(target_type);

-- ============================================
-- Phase 11: Platform Catalog & Tax & WebSocket
-- ============================================

-- Platform Product Catalog
CREATE TABLE IF NOT EXISTS platform_product (
    id              BIGINT          PRIMARY KEY,
    brand           VARCHAR(100)    NOT NULL DEFAULT 'DJI',
    name            VARCHAR(500)    NOT NULL,
    model           VARCHAR(200),
    category_id     BIGINT,
    description     TEXT,
    cover_image     VARCHAR(500),
    merchant_price  NUMERIC(18,2)   NOT NULL DEFAULT 0,
    sale_price      NUMERIC(18,2)   NOT NULL DEFAULT 0,
    original_price  NUMERIC(18,2),
    profit_amount   NUMERIC(18,2)   DEFAULT 0,
    profit_rate     NUMERIC(10,4)   DEFAULT 0,
    stock_mode      VARCHAR(30)     NOT NULL DEFAULT 'PLATFORM_GLOBAL',
    global_stock    INTEGER         NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ENABLE',
    sort            INTEGER         NOT NULL DEFAULT 0,
    created_by      BIGINT,
    updated_by      BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_pp_brand ON platform_product(brand);
CREATE INDEX IF NOT EXISTS idx_pp_category ON platform_product(category_id);
CREATE INDEX IF NOT EXISTS idx_pp_status ON platform_product(status);

-- Platform Product Image
CREATE TABLE IF NOT EXISTS platform_product_image (
    id                  BIGINT          PRIMARY KEY,
    platform_product_id BIGINT          NOT NULL,
    url                 VARCHAR(500)    NOT NULL,
    sort                INTEGER         NOT NULL DEFAULT 0,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ppi_product ON platform_product_image(platform_product_id);

-- Platform Product Translation
CREATE TABLE IF NOT EXISTS platform_product_translation (
    id                  BIGINT          PRIMARY KEY,
    platform_product_id BIGINT          NOT NULL,
    language_code       VARCHAR(10)     NOT NULL,
    country_code        VARCHAR(10),
    name                VARCHAR(500),
    description         TEXT,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ppt ON platform_product_translation(platform_product_id, language_code, COALESCE(country_code, ''));

-- Merchant Tax Notice
CREATE TABLE IF NOT EXISTS merchant_tax_notice (
    id                  BIGINT          PRIMARY KEY,
    merchant_id         BIGINT          NOT NULL,
    merchant_user_id    BIGINT          NOT NULL,
    title               VARCHAR(200)    NOT NULL,
    content             TEXT,
    tax_type            VARCHAR(50)     NOT NULL DEFAULT 'OTHER',
    amount              NUMERIC(18,2)   NOT NULL DEFAULT 0,
    currency_code       VARCHAR(10)     DEFAULT 'JPY',
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    force_popup         BOOLEAN         NOT NULL DEFAULT FALSE,
    block_until_paid    BOOLEAN         NOT NULL DEFAULT FALSE,
    due_at              TIMESTAMP,
    paid_at             TIMESTAMP,
    payment_method      VARCHAR(50),
    payment_proof       TEXT,
    reviewed_by         BIGINT,
    reviewed_at         TIMESTAMP,
    reject_reason       VARCHAR(500),
    created_by          BIGINT,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted             BOOLEAN         NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_mtn_merchant ON merchant_tax_notice(merchant_id);
CREATE INDEX IF NOT EXISTS idx_mtn_status ON merchant_tax_notice(status);

-- Alter existing tables
ALTER TABLE product ADD COLUMN IF NOT EXISTS platform_product_id BIGINT;
ALTER TABLE product ADD COLUMN IF NOT EXISTS listing_status VARCHAR(20) DEFAULT 'DRAFT';
ALTER TABLE product ADD COLUMN IF NOT EXISTS merchant_stock INTEGER DEFAULT 0;
ALTER TABLE product ADD COLUMN IF NOT EXISTS use_platform_price BOOLEAN DEFAULT TRUE;
ALTER TABLE product ADD COLUMN IF NOT EXISTS listed_at TIMESTAMP;

ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS order_source VARCHAR(50) DEFAULT 'CUSTOMER';
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS created_by_admin BIGINT;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS virtual_customer_id BIGINT;

-- 订单：商家垫付货款 / 结算（双订单模型）
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS goods_cost NUMERIC(18,2);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS merchant_profit NUMERIC(18,2);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS merchant_paid_status VARCHAR(20) DEFAULT 'UNPAID';
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS merchant_paid_at TIMESTAMP;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS expected_arrival_at TIMESTAMP;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS arrival_status VARCHAR(20) DEFAULT 'WAITING';
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS arrived_at TIMESTAMP;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS settlement_amount NUMERIC(18,2);
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS settle_status VARCHAR(20) DEFAULT 'NONE';
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS settlement_operator_id BIGINT;
ALTER TABLE mall_order ADD COLUMN IF NOT EXISTS settlement_remark VARCHAR(500);

CREATE TABLE IF NOT EXISTS order_settlement_record (
    id                  BIGINT          PRIMARY KEY,
    order_id            BIGINT          NOT NULL,
    merchant_id         BIGINT          NOT NULL,
    goods_cost          NUMERIC(18,2)   NOT NULL DEFAULT 0,
    merchant_profit     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    settlement_amount   NUMERIC(18,2)   NOT NULL DEFAULT 0,
    status              VARCHAR(20)     NOT NULL DEFAULT 'SETTLED',
    operator_id         BIGINT,
    remark              VARCHAR(500),
    settled_at          TIMESTAMP,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_settlement_order ON order_settlement_record(order_id);
CREATE INDEX IF NOT EXISTS idx_order_settlement_merchant ON order_settlement_record(merchant_id);

ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS is_virtual BOOLEAN DEFAULT FALSE;
ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS virtual_remark VARCHAR(500);
ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS created_by_admin BIGINT;

CREATE INDEX IF NOT EXISTS idx_product_pp ON product(platform_product_id);
