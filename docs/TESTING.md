# Mall System Testing Guide

## Environment Setup

```bash
# Copy environment configuration
cp .env.prod.example .env.prod
# Edit .env.prod with actual values

# Start all services
docker compose -f docker-compose.prod.yml up -d

# Verify services are running
docker compose -f docker-compose.prod.yml ps
```

Wait a few seconds for the API to fully start before running tests.

---

## Start Backend (Without Docker)

```bash
cd apps/api
mvn spring-boot:run
# API available at http://localhost:8080
```

## Start Frontends (Without Docker)

```bash
# Customer Web
cd apps/customer-web
npm run dev
# Available at http://localhost:4173

# Admin Web
cd apps/admin-web
pnpm run dev
# Available at http://localhost:5175

# Merchant Web
cd apps/merchant-web
pnpm run dev
# Available at http://localhost:5174
```

---

## Login Test (All 4 Account Types)

### Admin Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}'
```

Expected: `200` with token and user info with role `ADMIN`.

### Merchant Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"merchant@example.com","password":"merchant123456","loginType":"password"}'
```

Expected: `200` with token and user info with role `MERCHANT`.

### Customer Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"customer@example.com","password":"customer123456","loginType":"password"}'
```

Expected: `200` with token and user info with role `CUSTOMER`.

### Agent Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"agent@example.com","password":"agent123456","loginType":"password"}'
```

Expected: `200` with token and user info with role `AGENT`.

---

## Country/Language Test

### List Countries

```bash
curl http://localhost:8080/api/public/countries
```

Expected: Array of countries with `id`, `name`, `code`, `flagIcon`, `phoneCode`, `currencyCode`, `languages`.

### List Languages for Country

```bash
curl http://localhost:8080/api/public/countries/JP/languages
```

Expected: Array of languages with `code`, `name`, `nativeName`.

### Fetch I18n Translations

```bash
curl "http://localhost:8080/api/public/i18n?countryCode=JP&languageCode=ja&namespaces=common,home"
```

Expected: I18n messages object with translations.

---

## Product Management Test

### Get Customer Home Page

```bash
curl http://localhost:8080/api/customer/home \
  -H "X-Language-Code: en" \
  -H "X-Country-Code: US"
```

Expected: Banners, categories, and products.

### List Products by Category

```bash
curl http://localhost:8080/api/customer/products?categoryId=1
```

Expected: Paginated product list.

### Get Product Detail

```bash
curl http://localhost:8080/api/customer/products/1
```

Expected: Product with title, price, stock, images, reviews.

### Merchant Create Product

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"merchant@example.com","password":"merchant123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -X POST http://localhost:8080/api/merchant/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Product","price":99.99,"stock":100,"categoryId":1,"description":"Test description"}'
```

Expected: `200` with created product data.

### Admin Audit Product

```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Approve product (replace {productId})
curl -X PUT http://localhost:8080/api/admin/products/{productId}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: `200` with status `APPROVED`.

---

## Order Flow Test

### Add to Cart

```bash
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"customer@example.com","password":"customer123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -X POST http://localhost:8080/api/customer/cart \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

Expected: `200` with cart item.

### Get Cart

```bash
curl http://localhost:8080/api/customer/cart \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: Cart items list.

### Create Address

```bash
curl -X POST http://localhost:8080/api/customer/addresses \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverName":"Test User","receiverPhone":"090-1234-5678","country":"JP","province":"Tokyo","city":"Shinjuku","district":"","detail":"1-2-3 Test Building","postalCode":"160-0022","isDefault":true}'
```

Expected: `200` with address data.

### Create Order

```bash
curl -X POST http://localhost:8080/api/customer/orders \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"addressId":1,"remark":""}'
```

Expected: `200` with order data including `orderNo`.

### Pay Order

```bash
# Replace {orderId}
curl -X POST http://localhost:8080/api/customer/orders/{orderId}/pay \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"method":"SIMULATED"}'
```

Expected: `200` with payment confirmation.

### Get Order List

```bash
curl http://localhost:8080/api/customer/orders?page=1&size=10 \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: Paginated orders list.

### Get Order Detail

```bash
# Replace {orderId}
curl http://localhost:8080/api/customer/orders/{orderId} \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: Full order with items.

---

## Commission/Withdrawal Test

### Check Merchant Balance

```bash
MERCHANT_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"merchant@example.com","password":"merchant123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl http://localhost:8080/api/merchant/finance/balance \
  -H "Authorization: Bearer $MERCHANT_TOKEN"
```

Expected: Balance info with `balance`, `frozenBalance`, `totalSales`, `totalWithdrawn`.

### Create Withdrawal

```bash
curl -X POST http://localhost:8080/api/merchant/finance/withdraw \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"bankName":"Test Bank","bankAccount":"1234567","accountName":"Merchant Name","remark":"Test withdrawal"}'
```

Expected: `200` with withdrawal record, status `PENDING`.

### Admin Review Withdrawal

```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# List withdrawals
curl http://localhost:8080/api/admin/withdrawals?status=PENDING \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Approve withdrawal (replace {id})
curl -X PUT http://localhost:8080/api/admin/withdrawals/{id}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: `200` with status `APPROVED`.

### Agent Commission Check

```bash
AGENT_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"agent@example.com","password":"agent123456","loginType":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl http://localhost:8080/api/merchant/agent/balance \
  -H "Authorization: Bearer $AGENT_TOKEN"
```

Expected: Agent balance and commission info.

---

## Coupon/Refund Test

### Admin Create Coupon

```bash
curl -X POST http://localhost:8080/api/admin/coupons \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Coupon","code":"TEST20","type":"AMOUNT","amount":20,"minSpend":50,"totalQuantity":100,"startAt":"2026-01-01 00:00:00","endAt":"2027-12-31 23:59:59"}'
```

Expected: `200` with coupon data.

### Customer Receive Coupon

```bash
curl -X POST http://localhost:8080/api/customer/coupons/receive \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"couponId":1}'
```

Expected: `200` with user coupon.

### Use Coupon in Order

```bash
curl -X POST http://localhost:8080/api/customer/orders \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"addressId":1,"userCouponId":1,"remark":""}'
```

Expected: Order with `couponAmount` showing discount.

### Request Refund

```bash
# Replace {orderId}
curl -X POST http://localhost:8080/api/customer/orders/{orderId}/refund \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Product not as described"}'
```

Expected: `200` with refund status.

### Admin Process Refund

```bash
# List refunds
curl http://localhost:8080/api/admin/refunds?status=PENDING \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Approve refund (replace {id})
curl -X PUT http://localhost:8080/api/admin/refunds/{id}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: `200` with approved status and refunded amount.

---

## Review/Notification Test

### Customer Create Review

```bash
# Replace {orderId}, {orderItemId}, {productId}
curl -X POST http://localhost:8080/api/customer/reviews \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"orderItemId":1,"productId":1,"rating":5,"content":"Great product!"}'
```

Expected: `200` with review data.

### Get Product Reviews

```bash
curl http://localhost:8080/api/customer/reviews?productId=1 \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: Reviews list with user info.

### Merchant Reply to Review

```bash
curl -X PUT http://localhost:8080/api/merchant/reviews/1/reply \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"replyContent":"Thank you for your review!"}'
```

Expected: `200` with reply.

### Get Notifications

```bash
curl http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: Notification list.

### Mark Notification as Read

```bash
# Replace {id}
curl -X PUT http://localhost:8080/api/notifications/{id}/read \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: `200` with read status.

---

## Support/Inspection Test

### Customer Create Support Session

```bash
curl -X POST http://localhost:8080/api/customer/support/sessions \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionType":"PRODUCT_INQUIRY","title":"Question about product","relatedProductId":1}'
```

Expected: `200` with session data including `sessionNo`.

### Send Support Message

```bash
# Replace {sessionId}
curl -X POST http://localhost:8080/api/customer/support/sessions/{sessionId}/messages \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Can you tell me more about this product?","messageType":"TEXT"}'
```

Expected: `200` with message data.

### Merchant Reply

```bash
# Replace {sessionId}
curl -X POST http://localhost:8080/api/merchant/support/sessions/{sessionId}/messages \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"This product features...","messageType":"TEXT"}'
```

Expected: `200` with message data.

### Admin Inspection

```bash
# Create inspection session
curl -X POST http://localhost:8080/api/admin/support/inspections \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"merchantId":1,"fakeCustomerName":"Mystery Shopper","question":"What is your return policy?"}'

# Get inspection results (replace {id})
curl http://localhost:8080/api/admin/support/inspections/{id} \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: Inspection log with response time and quality score.

---

## Export Test

### Export Orders (Admin)

```bash
curl "http://localhost:8080/api/admin/orders/export?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -o orders.xlsx
```

Expected: Excel file download.

### Export Products (Merchant)

```bash
curl http://localhost:8080/api/merchant/products/export \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -o products.xlsx
```

Expected: Excel file download.

---

## Permission Isolation Test

### Customer Access Admin Endpoint (Should Fail)

```bash
curl http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: `403 Forbidden`.

### Merchant Access Admin Endpoint (Should Fail)

```bash
curl http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer $MERCHANT_TOKEN"
```

Expected: `403 Forbidden`.

### Unauthenticated Access Protected Endpoint (Should Fail)

```bash
curl http://localhost:8080/api/customer/cart
```

Expected: `401 Unauthorized`.

### Merchant Access Other Merchant Data (Should Be Isolated)

```bash
# Try to access another merchant's product by ID
curl http://localhost:8080/api/merchant/products/999 \
  -H "Authorization: Bearer $MERCHANT_TOKEN"
```

Expected: `403 Forbidden` or `404 Not Found` (data isolation).

### Agent Access Admin Endpoint (Should Fail)

```bash
curl http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer $AGENT_TOKEN"
```

Expected: `403 Forbidden`.

---

## Catalog/Listing Test

### Test Platform Product Catalog
```bash
A_TOKEN=$(login admin@example.com)
# Create platform product
curl -X POST http://localhost:8080/api/admin/catalog/products \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"brand":"DJI","name":"DJI Test","model":"Test1","categoryId":10,"description":"Test drone","merchantPrice":500,"salePrice":799,"originalPrice":999,"stockMode":"PLATFORM_GLOBAL","globalStock":100,"translations":[{"languageCode":"ja","name":"DJIテスト","description":"テスト用ドローン"},{"languageCode":"en","name":"DJI Test","description":"Test drone"}]}'
```

### Test Merchant Listing
```bash
M_TOKEN=$(login merchant@example.com)
# List from catalog
curl -X POST http://localhost:8080/api/merchant/catalog/products/1/list \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantStock":10,"listingStatus":"ON_SALE"}'
```

### Test Price Change WebSocket
1. Open customer-web in browser, visit a product page
2. Admin changes product price via API
3. Customer sees banner "Price updated"
4. Customer's cart/checkout detects price change

---

## Virtual Customer / Admin Order Test

### Test Virtual Customer
```bash
A_TOKEN=$(login admin@example.com)
curl -X POST http://localhost:8080/api/admin/customers/virtual \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"nickname":"Test Virtual","virtualRemark":"For testing"}'
```

### Test Admin Order Creation
```bash
A_TOKEN=$(login admin@example.com)
curl -X POST http://localhost:8080/api/admin/orders/create-for-merchant \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantId":2,"items":[{"platformProductId":1,"quantity":1}],"addressSnapshot":"Test address","markAsPaid":true}'
```

---

## Tax Notice Test

### Test Tax Notice
```bash
A_TOKEN=$(login admin@example.com)
curl -X POST http://localhost:8080/api/admin/tax/notices \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"merchantId":2,"title":"Tax 2026","taxType":"PLATFORM_TAX","amount":100,"forcePopup":true,"blockUntilPaid":true,"description":"Annual platform tax","dueDate":"2026-12-31T23:59:59"}'
```

### Merchant Submit Proof
```bash
M_TOKEN=$(login merchant@example.com)
curl -X POST http://localhost:8080/api/merchant/tax/notices/1/submit-proof \
  -H "Authorization: Bearer $M_TOKEN" -H "Content-Type: application/json" \
  -d '{"paymentMethod":"Bank Transfer","paymentProof":"https://picsum.photos/seed/proof/800/600","remark":"Paid"}'
```

### Admin Review Tax Notice
```bash
A_TOKEN=$(login admin@example.com)
curl -X PUT http://localhost:8080/api/admin/tax/notices/1/review \
  -H "Authorization: Bearer $A_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"PAID","remark":"Verified"}'
```

---

## WebSocket Test

### Test WebSocket Connection
1. Open browser devtools > Network > WS tab
2. Connect to ws://localhost:8080/ws
3. Verify STOMP CONNECT with Authorization header
4. Verify subscription to /user/queue/events

### Test Real-time Events
1. Login to any frontend
2. Browser console should show "WebSocket connected"
3. Admin creates a tax notice with forcePopup=true
4. Merchant sees real-time modal popup
