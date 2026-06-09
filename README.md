# Mall System

Multi-country, multi-language e-commerce platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Java 21, Spring Boot 3, Spring Security, JWT, MyBatis Plus, PostgreSQL |
| Admin Web | Vue 3, Vite, TypeScript, Element Plus, Pinia, VxeTable (based on DFAN-Admin) |
| Merchant Web | Vue 3, Vite, TypeScript, Element Plus, Pinia, VxeTable (based on DFAN-Admin) |
| Customer Web | React 18, Vite, TypeScript, Tailwind CSS, Zustand |

## Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8080 | http://localhost:8080 |
| API Docs (Knife4j) | 8080 | http://localhost:8080/doc.html |
| Customer Web | 4173 | http://localhost:4173 |
| Merchant Web | 5174 | http://localhost:5174 |
| Admin Web | 5175 | http://localhost:5175 |

## Quick Start

### 1. Start PostgreSQL & Redis
```bash
docker compose up -d
```

### 2. Start Backend API
```bash
cd apps/api
mvn spring-boot:run
```
The DataInitializer will automatically seed default data on first startup.
API docs: http://localhost:8080/doc.html

### 3. Start Frontend Apps
```bash
# Customer Web (React)
cd apps/customer-web
npm install
npm run dev

# Merchant Web (Vue, pnpm)
cd apps/merchant-web
pnpm install
pnpm run dev

# Admin Web (Vue, pnpm)
cd apps/admin-web
pnpm install
pnpm run dev
```

## System Roles

| Role | Code | Access |
|------|------|--------|
| SUPER_ADMIN | SUPER_ADMIN | Admin Web (full access) |
| ADMIN | ADMIN | Admin Web (limited) |
| MERCHANT | MERCHANT | Merchant Web |
| AGENT | AGENT | Merchant Web |
| CUSTOMER | CUSTOMER | Customer Web only |

## Default Test Accounts

| Account | Password | Role | Country/Lang |
|---------|----------|------|--------------|
| admin@example.com | admin123456 | SUPER_ADMIN | US / en |
| merchant@example.com | merchant123456 | MERCHANT | JP / ja |
| agent@example.com | agent123456 | AGENT | KR / ko |
| customer@example.com | customer123456 | CUSTOMER | JP / ja |

Password are BCrypt encrypted at startup by `DataInitializer`.

## Default Countries & Languages

| Country | Code | Default Language | Currency | Symbol |
|---------|------|------------------|----------|--------|
| Japan | JP | ja (日本語) | JPY | ¥ |
| South Korea | KR | ko (한국어) | KRW | ₩ |
| United States | US | en (English) | USD | $ |

Country-Language relations:
- JP: ja (default), en
- KR: ko (default), en
- US: en (default), ja, ko

## Role Isolation

- **Admin Web** (port 5175): Only SUPER_ADMIN and ADMIN can login. MERCHANT/AGENT/CUSTOMER are rejected.
- **Merchant Web** (port 5174): Only MERCHANT and AGENT can login. SUPER_ADMIN/ADMIN/CUSTOMER are rejected.
- **Customer Web** (port 4173): All roles can login, but CUSTOMER is the intended role.

## Testing

### Test Login API
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}'
```

### Test Current User
```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Test Permissions
```bash
curl http://localhost:8080/api/auth/permissions \
  -H "Authorization: Bearer <token>"
```

### Test Public Countries API
```bash
curl http://localhost:8080/api/public/countries
```

### Test Country Languages
```bash
curl http://localhost:8080/api/public/countries/JP/languages
```

### Test i18n API
```bash
curl "http://localhost:8080/api/public/i18n?countryCode=JP&languageCode=ja&namespaces=common,auth,error"
```

### Test Admin Web Login
1. Open http://localhost:5175
2. Login with admin@example.com / admin123456
3. Should see dashboard menu
4. Try customer@example.com / customer123456 → should be rejected

### Test Merchant Web Login
1. Open http://localhost:5174
2. Login with merchant@example.com / merchant123456
3. Should see merchant menu
4. Try admin@example.com → should be rejected

### Verify Role Isolation
- admin@example.com can access http://localhost:5175 but NOT http://localhost:5174
- merchant@example.com can access http://localhost:5174 but NOT http://localhost:5175
- customer@example.com cannot access either admin panel

## Project Structure

```
mall-system/
├── DFAN-Admin-main/          # Original DFAN admin template
├── apps/
│   ├── api/                  # Java Spring Boot backend (41 Java files)
│   │   └── src/main/java/com/mall/api/
│   │       ├── common/       # ApiResponse, BaseEntity, exceptions, enums
│   │       ├── security/     # JWT + Spring Security
│   │       ├── config/       # MyBatisPlus, CORS, Swagger
│   │       ├── modules/
│   │       │   ├── auth/     # Login/Register/Me/Permissions
│   │       │   ├── user/     # User entity + mapper
│   │       │   ├── country/  # Country entity + mapper
│   │       │   ├── language/ # Language entity + mapper
│   │       │   ├── i18n/     # I18n entities + mapper + service
│   │       │   └── publicapi/ # Public endpoints (countries, i18n)
│   │       └── common/initializer/  # DataInitializer (seed data)
│   ├── admin-web/            # Vue admin panel
│   ├── merchant-web/         # Vue merchant/agent panel
│   └── customer-web/         # React customer app
├── packages/shared/          # Shared TypeScript types
├── docker-compose.yml        # PostgreSQL 16 + Redis 7
├── .env.example
└── package.json
```

## Database Tables (38 tables)

sys_user, sys_role, sys_menu, sys_user_role, sys_role_menu, customer_profile, merchant, agent, category, category_translation, product, product_image, product_translation, cart_item, address, mall_order, order_item, payment, commission, withdrawal, banner, banner_translation, coupon, system_setting, audit_log, country, language, country_language, i18n_namespace, i18n_translation, support_session, support_message, support_read_state, support_quick_reply, support_inspection_log, platform_product, platform_product_translation, tax_notice

## Phase 2 Completed

- [x] 30 database tables with full schema
- [x] Auth connected to real database (BCrypt passwords, user lookup)
- [x] Countries initialized: Japan (JP), South Korea (KR), United States (US)
- [x] Languages initialized: Japanese (ja), Korean (ko), English (en)
- [x] Country-Language relations with defaults
- [x] I18n namespaces: common, auth, customer, merchant, admin, product, order, payment, withdrawal, error, finance, system, i18n
- [x] I18n translations: 100+ translation entries across ja/ko/en
- [x] Public API: /api/public/countries, /api/public/countries/{code}/languages, /api/public/i18n
- [x] Error code-based i18n in BusinessException and GlobalExceptionHandler
- [x] Admin-web role isolation (SUPER_ADMIN/ADMIN only)
- [x] Merchant-web role isolation (MERCHANT/AGENT only)
- [x] Customer-web i18n loading from API
- [x] DataInitializer with proper BCrypt password encoding
- [x] Request headers: X-Country-Code, X-Language-Code, Accept-Language

## Phase 3 Completed

- [x] Admin i18n management REST API: `/api/admin/i18n/*`
- [x] Country CRUD: list, create, edit, enable/disable, delete
- [x] Language CRUD: list, create, edit, enable/disable, delete
- [x] Country-Language binding: add, set default, delete
- [x] Namespace CRUD: list, create, edit, enable/disable, delete
- [x] Translation CRUD: list, create, edit, enable/disable, delete
- [x] JSON import: `POST /api/admin/i18n/translations/import`
- [x] JSON export: `GET /api/admin/i18n/translations/export`
- [x] Audit log AOP aspect with `@Audit` annotation
- [x] I18n cache with automatic invalidation on modifications
- [x] Admin-web 5 i18n management pages (country, language, country-language, namespace, translation)
- [x] Admin-web dynamic language loading from backend API
- [x] Merchant-web dynamic language loading from backend API
- [x] Customer-web country/language switching with API-loaded messages

## Accessing I18n Management

1. Start all services and login to admin-web (http://localhost:5175) as `admin@example.com`
2. Navigate to "国际化管理" in the sidebar menu
3. Sub-pages:
   - **Country Management**: `/i18n/country` - Add/edit/delete countries
   - **Language Management**: `/i18n/language` - Add/edit/delete languages
   - **Country-Language Config**: `/i18n/country-language` - Bind languages to countries, set defaults
   - **Namespace Management**: `/i18n/namespace` - Manage i18n modules
   - **Translation Management**: `/i18n/translation` - Manage translations, import/export JSON

## Testing i18n Management

```bash
# List countries
curl http://localhost:8080/api/admin/i18n/countries \
  -H "Authorization: Bearer <admin_token>"

# Create a language
curl -X POST http://localhost:8080/api/admin/i18n/languages \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"French","nativeName":"Français","code":"fr","status":"ENABLE","sort":4}'

# Import translations
curl -X POST http://localhost:8080/api/admin/i18n/translations/import \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"languageCode":"ja","namespaceCode":"auth","overwrite":true,"messages":{"auth.login.title":"ログイン","auth.login.submit":"送信"}}'

# Export translations
curl "http://localhost:8080/api/admin/i18n/translations/export?languageCode=ja&namespaceCode=auth" \
  -H "Authorization: Bearer <admin_token>"
```

## Testing Dynamic Language Switch

1. Login to admin-web (http://localhost:5175)
2. Click language selector in header
3. Switch language - page reloads with new language
4. Verify translations update: check button labels, menu titles
5. Add new translations via admin panel → refresh → verify changes

## Phase 4 Completed

- [x] 6 categories seeded (Electronics, Beauty, Fashion, Home, Health, Digital) with ja/ko/en translations
- [x] 3 banners seeded with ja/ko/en translations
- [x] 12 products seeded with images and ja/ko/en translations (merchant@example.com)
- [x] Customer home API: `/api/customer/home` (banners + categories + recommended + hot products)
- [x] Customer categories API: `/api/customer/categories`
- [x] Customer products API: `/api/customer/products` (keyword, category, price, sort, pagination)
- [x] Customer product detail API: `/api/customer/products/{id}`
- [x] Merchant product CRUD: `/api/merchant/products`
- [x] Merchant submit audit: `/api/merchant/products/{id}/submit-audit`
- [x] Merchant product translations: `/api/merchant/products/{id}/translations`
- [x] Admin categories CRUD + translations: `/api/admin/categories`
- [x] Admin banners CRUD + translations: `/api/admin/banners`
- [x] Admin product list + status management: `/api/admin/products`
- [x] Admin product audit (approve/reject): `/api/admin/products/audit`
- [x] admin-web: Category management page (`/product/category`)
- [x] admin-web: Banner management page (`/product/banner`)
- [x] admin-web: Product list page (`/product/list`)
- [x] admin-web: Product audit page (`/product/audit`)
- [x] merchant-web: My products page (`/product/list`)
- [x] merchant-web: Product create/edit page (`/product/edit`)
- [x] merchant-web: Product translation page (`/product/translation`)
- [x] customer-web: Home page with banners, categories, products
- [x] customer-web: Category page
- [x] customer-web: Product list with search, sort, pagination
- [x] customer-web: Product detail with images, info
- [x] Multi-language product/banner/category display via X-Country-Code/X-Language-Code headers
- [x] Audit log (audit_log) for all CRUD and audit operations

## Testing Phase 4

### Test Customer Home
```bash
curl http://localhost:8080/api/customer/home \
  -H "X-Country-Code: JP" -H "X-Language-Code: ja"
```

### Test Product List
```bash
curl "http://localhost:8080/api/customer/products?categoryId=10&sort=priceAsc&page=1&pageSize=10" \
  -H "X-Country-Code: JP" -H "X-Language-Code: ja"
```

### Test Product Detail
```bash
curl http://localhost:8080/api/customer/products/100 \
  -H "X-Language-Code: en"
```

### Test Admin Category Management
```bash
# Login first to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}'

# List categories
curl http://localhost:8080/api/admin/categories \
  -H "Authorization: Bearer <token>"
```

### Test Admin Banner Management
```bash
curl http://localhost:8080/api/admin/banners \
  -H "Authorization: Bearer <token>"
```

### Test Admin Product Audit
```bash
# List pending products
curl http://localhost:8080/api/admin/products/audit \
  -H "Authorization: Bearer <token>"

# Approve a product
curl -X PUT http://localhost:8080/api/admin/products/100/audit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"auditStatus":"APPROVED","auditRemark":"Good quality"}'
```

### Test Merchant Product Management
```bash
# Login as merchant
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"merchant@example.com","password":"merchant123456","loginType":"password"}'

# Create product
curl -X POST http://localhost:8080/api/merchant/products \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"categoryId":10,"title":"Test Product","description":"Description","coverImage":"https://picsum.photos/seed/t1/800/800","price":29.99,"originalPrice":39.99,"stock":50,"images":["https://picsum.photos/seed/t1a/800/800"],"translations":[{"languageCode":"ja","title":"テスト商品","description":"説明文"}]}'

# Submit for audit
curl -X POST http://localhost:8080/api/merchant/products/<id>/submit-audit \
  -H "Authorization: Bearer <token>"
```

## Phase 5 Completed

- [x] Cart API: add/update/delete/clear/select-all items
- [x] Address API: CRUD with default address logic
- [x] Order API: create from cart or buy-now, cancel, pay, confirm receipt
- [x] Mock payment: stock deduction, sales increase, merchant frozen_balance
- [x] Merchant order management: list, detail, ship
- [x] Admin order management: list with filters, detail, status update
- [x] Order status i18n: ja/ko/en translations for order, payment, cart, address
- [x] Error i18n: order.notFound, order.stockNotEnough, order.multiMerchantNotSupported, etc.
- [x] customer-web: Cart, Address, Checkout, Payment, Payment Result, Orders, Order Detail pages
- [x] merchant-web: Order list + ship page
- [x] admin-web: Order management page
- [x] Stock deduction + sales increase on payment
- [x] Merchant frozen_balance increase on payment, transfer to balance on completion
- [x] @Transactional on all critical order/payment operations
- [x] All order status changes logged via audit_log

### Not Yet Implemented (Deferred to Phase 6)
- Commission calculation and settlement
- Withdrawal request and review
- Coupon discount application
- Refund flow

## Testing Phase 5

### Test Cart
```bash
# Login as customer
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"customer@example.com","password":"customer123456","loginType":"password"}' | jq -r '.data.token')

# Add to cart
curl -X POST http://localhost:8080/api/customer/cart/items \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"productId":100,"quantity":2}'

# View cart
curl http://localhost:8080/api/customer/cart -H "Authorization: Bearer $TOKEN"
```

### Test Address
```bash
curl -X POST http://localhost:8080/api/customer/addresses \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"receiverName":"Taro Yamada","phone":"090-1234-5678","country":"Japan","province":"Tokyo","city":"Shibuya","detail":"1-2-3 Shibuya","postalCode":"150-0001","isDefault":true}'
```

### Test Create Order
```bash
curl -X POST http://localhost:8080/api/customer/orders \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"source":"CART","cartItemIds":[1],"addressId":1,"remark":"Please deliver quickly"}'
```

### Test Pay Order
```bash
curl -X POST http://localhost:8080/api/customer/orders/1/pay \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"method":"MOCK"}'
```

### Test Merchant Ship
```bash
M_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"merchant@example.com","password":"merchant123456","loginType":"password"}' | jq -r '.data.token')

curl -X POST http://localhost:8080/api/merchant/orders/1/ship \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"logisticsCompany":"Yamato Transport","trackingNo":"1234-5678-9012"}'
```

### Test Customer Confirm Receipt
```bash
curl -X POST http://localhost:8080/api/customer/orders/1/confirm \
  -H "Authorization: Bearer $TOKEN"
```

## Phase 6 Completed

- [x] Commission entity + mapper + service with frozen/settled/cancelled lifecycle
- [x] Withdrawal entity + mapper + service with approve/reject flow
- [x] System settings: default_commission_rate=0.05, min withdrawal thresholds
- [x] Commission generated on payment (if buyer has agent via customer_profile.invited_by)
- [x] Commission settled on order confirmation (frozen → settled, agent balance transfer)
- [x] Merchant withdrawal: decrease balance → increase frozen → apply
- [x] Agent withdrawal: decrease balance → increase frozen → apply
- [x] Admin approve withdrawal: decrease frozen → increase total_withdrawn
- [x] Admin reject withdrawal: decrease frozen → return to balance
- [x] Merchant finance summary API
- [x] Agent finance summary API
- [x] Admin finance overview API (platform-wide stats)
- [x] Admin withdrawal list/detail/approve/reject API
- [x] Admin commission records API
- [x] Admin payment records API
- [x] merchant-web: Finance overview, commission records, withdrawal apply, withdrawal records pages
- [x] admin-web: Finance overview, withdrawal audit, commission records, payment records pages
- [x] I18n: 60+ finance/commission/withdrawal/payment translations (ja/ko/en)
- [x] All balance changes @Transactional + audit_log

## Testing Phase 6

### Test Commission Flow
```bash
# 1. Ensure customer has an agent (check customer_profile.invited_by)
# 2. Customer creates and pays an order
# 3. Verify commission record created (status=FROZEN)
# 4. Verify agent.frozen_balance increased
# 5. Merchant ships, customer confirms receipt
# 6. Verify commission status → SETTLED
# 7. Verify agent.balance increased, frozen_balance decreased
```

### Test Merchant Withdrawal
```bash
M_TOKEN=$(login merchant@example.com)
# View summary
curl http://localhost:8080/api/merchant/finance/summary -H "Authorization: Bearer $M_TOKEN"
# Apply
curl -X POST http://localhost:8080/api/merchant/finance/withdrawals \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":50,"bankName":"MUFG Bank","bankAccount":"1234567","accountName":"Merchant","remark":"Monthly withdrawal"}'
```

### Test Admin Withdrawal Audit
```bash
A_TOKEN=$(login admin@example.com)
# List
curl http://localhost:8080/api/admin/withdrawals -H "Authorization: Bearer $A_TOKEN"
# Approve
curl -X PUT http://localhost:8080/api/admin/withdrawals/1/approve -H "Authorization: Bearer $A_TOKEN"
# Reject
curl -X PUT http://localhost:8080/api/admin/withdrawals/2/reject \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"rejectReason":"Invalid bank details"}'
```

### Test Finance Overview
```bash
curl http://localhost:8080/api/admin/finance/overview -H "Authorization: Bearer $A_TOKEN"
```

### Test Payment Records
```bash
curl http://localhost:8080/api/admin/payments -H "Authorization: Bearer $A_TOKEN"
```

## Phase 7 Completed

- [x] Roles seeded: SUPER_ADMIN, ADMIN, MERCHANT, AGENT, CUSTOMER
- [x] Menus seeded: ~40 ADMIN menus + 15 MERCHANT menus + 20+ button permissions
- [x] Role-menu assignments: SUPER_ADMIN=all, ADMIN=most, MERCHANT=merchant menus, AGENT=finance+agent
- [x] Dynamic permissions: `/api/auth/permissions` now reads from sys_menu/sys_role_menu
- [x] Admin user list/detail/update/status/password-reset APIs
- [x] Customer management: list, detail, edit, status toggle
- [x] Merchant management: list, create, edit, status toggle
- [x] Agent management: list, create, edit, status, customers, commissions
- [x] Admin user management (SUPER_ADMIN only): list, create, edit, delete, password reset
- [x] Role management: CRUD + menu assignment
- [x] Menu management: tree view, CRUD, appType filter (ADMIN/MERCHANT)
- [x] Merchant profile: view/edit shop info
- [x] Agent invite: invite code, stats, customer list, team list
- [x] admin-web: 4 user management + 2 system pages (customer/merchant/agent/admin/role/menu)
- [x] merchant-web: 4 pages (shop profile, agent invite, customers, team)
- [x] I18n: 120+ user/role/menu translations (ja/ko/en)
- [x] Permission boundaries: ADMIN can't modify SUPER_ADMIN, can't disable self

## Testing Phase 7

### Test Dynamic Permissions
```bash
# Login as different roles and compare menus
A_TOKEN=$(login admin@example.com)
M_TOKEN=$(login merchant@example.com)

# SUPER_ADMIN sees full admin menu
curl http://localhost:8080/api/auth/permissions -H "Authorization: Bearer $A_TOKEN"
# MERCHANT sees merchant menus
curl http://localhost:8080/api/auth/permissions -H "Authorization: Bearer $M_TOKEN"
```

### Test User Management
```bash
# List customers
curl "http://localhost:8080/api/admin/customers?page=1&pageSize=10" -H "Authorization: Bearer $A_TOKEN"

# Create merchant
curl -X POST http://localhost:8080/api/admin/merchants \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"shop@test.com","password":"pass123","nickname":"Test Shop","countryCode":"JP","languageCode":"ja","merchantName":"Test Store"}'

# Create agent
curl -X POST http://localhost:8080/api/admin/agents \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"agent2@test.com","password":"pass123","nickname":"Agent 2","countryCode":"KR","languageCode":"ko","commissionRate":0.1}'

# Create admin (SUPER_ADMIN only)
curl -X POST http://localhost:8080/api/admin/admin-users \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"admin2@test.com","password":"pass123","nickname":"Admin 2","role":"ADMIN","countryCode":"US","languageCode":"en"}'
```

### Test Role Menu Assignment
```bash
# Get role menus
curl http://localhost:8080/api/admin/roles/2/menus -H "Authorization: Bearer $A_TOKEN"

# Assign menus to role
curl -X PUT http://localhost:8080/api/admin/roles/2/menus \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"menuIds":[1000,1001,1100,1101]}'
```

### Test Merchant Profile
```bash
curl http://localhost:8080/api/merchant/profile -H "Authorization: Bearer $M_TOKEN"
```

## Phase 8 Completed

- [x] Coupon table: AMOUNT/PERCENT types, quantities, date range, per-user limit
- [x] Coupon translation table: multi-language name/description
- [x] User coupon table: UNUSED/USED/EXPIRED status, order binding
- [x] Order refund fields: refund_status, refund_amount, refund_reason, etc.
- [x] Payment refund fields: refunded_amount, refunded_at
- [x] Customer coupon API: available list, receive, my coupons, usable coupons
- [x] Admin coupon API: full CRUD + records
- [x] Coupon discount in order creation: validate, calculate, deduct
- [x] Coupon restore on order cancel (if UNPAID)
- [x] Customer refund request API
- [x] Admin refund list/detail/approve/reject API
- [x] Refund approve: stock restore, merchant balance rollback, commission cancel (full @Transactional)
- [x] Refund reject: restore order status
- [x] Admin audit log API with filtering
- [x] Admin dashboard API: platform-wide statistics
- [x] Merchant dashboard API: MERCHANT/AGENT role-aware stats
- [x] customer-web: Coupon page, checkout coupon selection, refund request, order detail refund info
- [x] admin-web: Coupon management, refund audit, audit log viewer, dashboard pages
- [x] merchant-web: Dashboard page (role-aware)
- [x] I18n: 120+ coupon/refund/audit/dashboard translations (ja/ko/en)

## Testing Phase 8

### Test Coupon Create + Receive
```bash
A_TOKEN=$(login admin@example.com)
# Create coupon
curl -X POST http://localhost:8080/api/admin/coupons \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Welcome Coupon","code":"WELCOME10","type":"AMOUNT","amount":10,"minSpend":50,"totalQuantity":100,"perUserLimit":1,"startAt":"2026-01-01T00:00:00","endAt":"2026-12-31T23:59:59","translations":[{"languageCode":"ja","name":"ウェルカムクーポン","description":"初回購入割引"}]}'

C_TOKEN=$(login customer@example.com)
# Receive
curl -X POST http://localhost:8080/api/customer/coupons/1/receive -H "Authorization: Bearer $C_TOKEN"
```

### Test Order with Coupon
```bash
# Check usable coupons
curl "http://localhost:8080/api/customer/coupons/usable?amount=100" -H "Authorization: Bearer $C_TOKEN"
# Create order with coupon
curl -X POST http://localhost:8080/api/customer/orders \
  -H "Authorization: Bearer $C_TOKEN" -H "Content-Type: application/json" \
  -d '{"source":"BUY_NOW","productId":100,"quantity":2,"addressId":1,"userCouponId":1}'
```

### Test Refund
```bash
# Request refund
curl -X POST http://localhost:8080/api/customer/orders/1/refund \
  -H "Authorization: Bearer $C_TOKEN" -H "Content-Type: application/json" \
  -d '{"reason":"Product not as described"}'
# Admin approve
curl -X PUT http://localhost:8080/api/admin/refunds/1/approve -H "Authorization: Bearer $A_TOKEN"
```

### Test Audit Log
```bash
curl "http://localhost:8080/api/admin/audit-logs?page=1&pageSize=20" -H "Authorization: Bearer $A_TOKEN"
```

### Test Dashboard
```bash
curl http://localhost:8080/api/admin/dashboard -H "Authorization: Bearer $A_TOKEN"
curl http://localhost:8080/api/merchant/dashboard -H "Authorization: Bearer $M_TOKEN"
```

## Phase 9 Completed

- [x] File upload service: /api/upload/image with type/size validation, local storage
- [x] Product review system with ratings (1-5), images, merchant reply
- [x] Notification system: auto-create on key events, list/unread/mark-read
- [x] CSV export: orders, payments, withdrawals, commissions
- [x] System settings management page
- [x] Dashboard ECharts: sales trends, order stats, distributions
- [x] Image upload integration in Banner, Product, Shop Profile pages
- [x] customer-web: review create, product reviews, notification center
- [x] admin-web: review mgmt, notification list, settings, dashboard charts
- [x] merchant-web: review reply, notification list, dashboard charts
- [x] I18n: 120+ translations (upload, review, notification, export, settings, charts)

**Total: 160 Java files, 13 customer-web pages, 16 admin-web pages, 12 merchant-web pages**

## Phase 10 Completed - Customer Service System

- [x] 5 support tables: support_session, support_message, support_read_state, support_quick_reply, support_inspection_log
- [x] 3 session types: CUSTOMER_TO_MERCHANT, MERCHANT_TO_PLATFORM, ADMIN_INSPECTION_TO_MERCHANT
- [x] Customer initiates support from product/order detail pages
- [x] Merchant replies to customers via merchant-web support center
- [x] Merchant/Agent contacts platform via merchant-web
- [x] Admin replies to platform inquiries via admin-web
- [x] Admin creates inspection sessions (impersonates customer to test merchant response)
- [x] Inspection sessions hidden from merchant (appear as regular customer inquiries)
- [x] Admin scores inspection sessions (1-5) with quality remarks
- [x] Quick replies: platform-wide and merchant-specific
- [x] HTTP polling: 15s list refresh, 5s chat refresh
- [x] Text + image messages via existing upload API
- [x] Notification integration: all support events create notifications
- [x] Audit log integration: all support operations logged
- [x] I18n: support.*, error.support.* translations (ja/ko/en)
- [x] customer-web: SupportSessionsPage, SupportChatPage
- [x] merchant-web: customer support, platform support, quick replies pages
- [x] admin-web: customer-merchant monitor, platform support, inspection, quick replies pages
- [x] Menu permissions: support menus + button permissions seeded

**Total: 182 Java files, 15 customer-web pages, 15 merchant-web pages, 20 admin-web pages**

## Testing Phase 10

### Customer → Merchant Support
```bash
C_TOKEN=$(login customer@example.com)
# Create session
curl -X POST http://localhost:8080/api/customer/support/sessions \
  -H "Authorization: Bearer $C_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantId":2,"title":"Product question","content":"Is this in stock?"}'
# View sessions
curl http://localhost:8080/api/customer/support/sessions -H "Authorization: Bearer $C_TOKEN"
# Send message
curl -X POST http://localhost:8080/api/customer/support/sessions/1/messages \
  -H "Authorization: Bearer $C_TOKEN" -H "Content-Type: application/json" \
  -d '{"content":"Thank you!","messageType":"TEXT"}'
```

### Merchant Reply
```bash
M_TOKEN=$(login merchant@example.com)
# View customer sessions
curl http://localhost:8080/api/merchant/support/customer-sessions -H "Authorization: Bearer $M_TOKEN"
# Reply
curl -X POST http://localhost:8080/api/merchant/support/customer-sessions/1/messages \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"content":"Yes, it is in stock!","messageType":"TEXT"}'
```

### Admin Inspection
```bash
A_TOKEN=$(login admin@example.com)
# Create inspection session
curl -X POST http://localhost:8080/api/admin/support/inspection-sessions \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantId":2,"fakeCustomerName":"Taro","title":"Delivery time","question":"How long does delivery take?","priority":"NORMAL"}'
# Score inspection after merchant replies
curl -X PUT http://localhost:8080/api/admin/support/inspection-sessions/1/score \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"qualityScore":4,"qualityRemark":"Responded within 5 minutes"}'
```

## Phase 11 Completed - Platform Catalog & Tax System

- [x] Platform unified product catalog (platform_product + platform_product_translation tables)
- [x] 6 DJI products seeded: Mini 4 Pro, Air 3, Mavic 3 Pro, RC 2 Remote, Goggles 3, Osmo Action 5
- [x] Merchant can only list products from platform catalog (cannot create freeform products)
- [x] All prices controlled by admin: merchantPrice (cost to merchant), salePrice (customer price)
- [x] Merchant profit = salePrice - merchantPrice, auto-calculated as profitAmount and profitRate
- [x] Virtual customers: admin can create customer accounts for order testing
- [x] Admin can create orders on behalf of customers (/order/create) via admin-web
- [x] Admin order creation: select customer, select merchant, select catalog product, set quantity
- [x] Tax/fee notices system: admin creates tax notices for merchants with forced popup
- [x] Merchants can view notices and submit proof of payment
- [x] Tax notice statuses: PENDING, SUBMITTED (with proof), PAID (admin reviewed), OVERDUE
- [x] WebSocket real-time notifications for: price changes, catalog updates, tax notices
- [x] WebSocket connection status display: Connected / Disconnected / Reconnecting
- [x] i18n: 150+ catalog/tax/websocket/order-adminCreate translations (ja/ko/en)
- [x] Menu permissions: admin catalog/tax/order-create menus + merchant catalog/tax menus
- [x] Button permissions: admin:catalog:add/edit/disable, admin:tax:create/review, admin:order:create
- [x] Button permissions: merchant:catalog:list, merchant:listing:edit, merchant:tax:submitProof
- [x] DataInitializer: catalog/tax/websocket namespaces seeded
- [x] PlatformProduct fields: brand, name, model, categoryId, merchantPrice, salePrice, originalPrice, profitAmount, profitRate, stockMode, globalStock, description, sort

**Total: 195+ Java files, 17 customer-web pages, 17 merchant-web pages, 23 admin-web pages**

## Testing Phase 11

### Test Admin Catalog Management
```bash
A_TOKEN=$(login admin@example.com)
# List platform products
curl http://localhost:8080/api/admin/catalog/products -H "Authorization: Bearer $A_TOKEN"
# Create new catalog product
curl -X POST http://localhost:8080/api/admin/catalog/products \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"brand":"DJI","name":"DJI Neo","model":"Neo","categoryId":10,"description":"Lightweight selfie drone","merchantPrice":150,"salePrice":199,"originalPrice":249,"stockMode":"PLATFORM_GLOBAL","globalStock":200}'
# Edit catalog product
curl -X PUT http://localhost:8080/api/admin/catalog/products/1 \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"salePrice":1049}'
# Disable catalog product
curl -X PUT http://localhost:8080/api/admin/catalog/products/1/disable -H "Authorization: Bearer $A_TOKEN"
```

### Test Merchant Listing from Catalog
```bash
M_TOKEN=$(login merchant@example.com)
# View catalog library
curl http://localhost:8080/api/merchant/catalog/library -H "Authorization: Bearer $M_TOKEN"
# List a catalog product (merchant lists it in their shop)
curl -X POST http://localhost:8080/api/merchant/catalog/products/1/list \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"markup":50}'
# Merchant cannot create freeform products anymore (must use catalog)
# Old product creation endpoint returns 400 if not from catalog
```

### Test Admin Create Order
```bash
A_TOKEN=$(login admin@example.com)
# Create order for a customer
curl -X POST http://localhost:8080/api/admin/orders \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"customerId":4,"merchantId":2,"items":[{"platformProductId":1,"quantity":1}],"addressId":1,"remark":"Admin created test order"}'
```

### Test Tax Notices
```bash
A_TOKEN=$(login admin@example.com)
# Create tax notice for a merchant
curl -X POST http://localhost:8080/api/admin/tax/notices \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantId":2,"title":"Monthly Consumption Tax","description":"Tax for June 2026 sales","amount":1500,"dueDate":"2026-07-31T23:59:59","forced":true}'
# List tax notices
curl http://localhost:8080/api/admin/tax/notices -H "Authorization: Bearer $A_TOKEN"

M_TOKEN=$(login merchant@example.com)
# View merchant tax notices
curl http://localhost:8080/api/merchant/tax/notices -H "Authorization: Bearer $M_TOKEN"
# Submit proof
curl -X POST http://localhost:8080/api/merchant/tax/notices/1/submit-proof \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"proofImage":"https://picsum.photos/seed/tax1/800/600","remark":"Paid via bank transfer"}'

# Admin review and mark paid
curl -X PUT http://localhost:8080/api/admin/tax/notices/1/review \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"PAID","remark":"Payment verified"}'
```

### Test WebSocket Notifications
```bash
# Connect via WebSocket (using wscat or browser console)
# ws://localhost:8080/ws/notifications?token=<JWT_TOKEN>
# Subscribe to topics: catalog, tax, price
# Send message format: {"type":"SUBSCRIBE","topic":"catalog"}
# Server pushes: {"type":"NOTIFICATION","topic":"catalog","data":{"action":"PRICE_UPDATE","productId":1,"oldPrice":999,"newPrice":1049}}
```

### Test Catalog i18n
```bash
# Get catalog product with translation
curl "http://localhost:8080/api/public/catalog/products/1" -H "X-Language-Code: ja"
curl "http://localhost:8080/api/public/catalog/products/1" -H "X-Language-Code: ko"
```

## WebSocket Configuration

- **Development**: connects to `ws://localhost:8080/ws` directly (override via `VITE_WS_URL`)
- **Production**: Nginx proxies `/ws` to backend with Upgrade headers
- **Frontend env**: `VITE_WS_URL` (optional, auto-derived from `window.location`)
- **Frontend auto-reconnect**: 5-second interval on disconnect
- **admin-web/merchant-web**: Uses SockJS + STOMP over `/ws`
- **customer-web**: Uses native WebSocket with token in query string

## Platform Catalog Rules

- All products created by Admin only (platform_product table)
- Brand defaults to DJI
- `merchantPrice` < `salePrice` enforced
- Profit = `salePrice` - `merchantPrice` (auto-calculated as `profitAmount` and `profitRate`)
- Merchants can only list from catalog (freeform product creation disabled)
- Merchant sets `merchantStock` and `listingStatus` for their listing

## How to Test WebSocket

1. Start backend + any frontend
2. Login → browser console should show "WebSocket connected"
3. Create/update a platform product → other clients receive event
4. Create a tax notice with `forcePopup` → merchant sees modal

## Production Deployment

```bash
cp .env.prod.example .env   # Edit with real passwords
docker compose -f docker-compose.prod.yml up -d
curl http://localhost:8080/api/health
```

### Environment Variables
DB_NAME, DB_USERNAME, DB_PASSWORD, JWT_SECRET (min 32 chars), JWT_EXPIRE_SECONDS, CORS_ALLOWED_ORIGINS

### Backup
```bash
./deploy/scripts/backup-db.sh      # PostgreSQL backup
./deploy/scripts/backup-uploads.sh # Uploads backup
./deploy/scripts/smoke-test.sh     # Quick API test
```

### Disable Rate Limiting
```bash
curl -X PUT http://localhost:8080/api/admin/settings/rate_limit.enabled \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"false"}'
```

## What's NOT Implemented
- Multi-level agent commission, Email SMTP, SKU/variants, Elasticsearch, Performance monitoring, CI/CD

## Project Statistics
| Component | Count |
|-----------|-------|
| Backend Java files | 195 |
| Database tables | 38+ |
| customer-web pages | 17 |
| merchant-web pages | 17 |
| admin-web pages | 23 |
| API endpoints | 200+ |
| i18n translations | 750+ (ja/ko/en) |
| Countries | JP, KR, US |
