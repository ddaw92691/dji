#!/bin/bash
BASE_URL="${API_URL:-http://localhost:8080}"
echo "=== Mall System Smoke Test ==="
echo "Testing $BASE_URL"
echo "--- Health Check ---"
curl -s "$BASE_URL/api/health" | head -c 200
echo ""
echo "--- Countries ---"
curl -s "$BASE_URL/api/public/countries" | head -c 200
echo ""
echo "--- Login ---"
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"account":"admin@example.com","password":"admin123456","loginType":"password"}' | grep -o '"token":"[^"]*"' | head -1)
if [ -n "$TOKEN" ]; then echo "Login: OK"; else echo "Login: FAILED"; fi
echo "--- Customer Home ---"
curl -s "$BASE_URL/api/customer/home" -H "X-Language-Code: en" | head -c 200
echo ""
echo "=== Smoke Test Complete ==="
