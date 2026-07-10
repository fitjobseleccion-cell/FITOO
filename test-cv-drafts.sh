#!/bin/bash

# CV Drafts Endpoints Test Suite
# Tests the GET /load and POST /save endpoints

BASE_URL="http://localhost:3001/api"
echo "========================================"
echo "CV DRAFTS ENDPOINTS TEST SUITE"
echo "========================================"
echo "Base URL: $BASE_URL"
echo ""

# PRUEBA 1: GET /cv-drafts/load with non-existent user
echo "PRUEBA 1: GET /cv-drafts/load?userId=test-user-no-existe"
echo "Expected: 200 status, { formData: null, updatedAt: null }"
echo "---"
RESPONSE1=$(curl -s -w "\n%{http_code}" "$BASE_URL/cv-drafts/load?userId=test-user-no-existe")
HTTP_CODE1=$(echo "$RESPONSE1" | tail -n1)
BODY1=$(echo "$RESPONSE1" | head -n-1)
echo "Actual Status: $HTTP_CODE1"
echo "Response Body:"
echo "$BODY1" | jq . 2>/dev/null || echo "$BODY1"
echo ""

# PRUEBA 2: POST /cv-drafts/save - Create new draft
echo "PRUEBA 2: POST /cv-drafts/save - Create new draft"
echo "Expected: 201 status, { success: true, updatedAt: '...' }"
echo "---"
RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/cv-drafts/save" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "formData": {
      "nombre": "Juan Pérez",
      "puesto": "Desarrollador Full Stack",
      "email": "juan@example.com"
    }
  }')
HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
BODY2=$(echo "$RESPONSE2" | head -n-1)
echo "Actual Status: $HTTP_CODE2"
echo "Response Body:"
echo "$BODY2" | jq . 2>/dev/null || echo "$BODY2"
echo ""

# PRUEBA 3: GET /cv-drafts/load - Retrieve saved draft
echo "PRUEBA 3: GET /cv-drafts/load?userId=test-user-123"
echo "Expected: 200 status, response contains saved formData"
echo "---"
RESPONSE3=$(curl -s -w "\n%{http_code}" "$BASE_URL/cv-drafts/load?userId=test-user-123")
HTTP_CODE3=$(echo "$RESPONSE3" | tail -n1)
BODY3=$(echo "$RESPONSE3" | head -n-1)
echo "Actual Status: $HTTP_CODE3"
echo "Response Body:"
echo "$BODY3" | jq . 2>/dev/null || echo "$BODY3"
echo ""

# PRUEBA 4: POST /cv-drafts/save - Update existing draft
echo "PRUEBA 4: POST /cv-drafts/save - Update existing draft"
echo "Expected: 200 status (update, not create), { success: true, updatedAt: '...' }"
echo "---"
RESPONSE4=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/cv-drafts/save" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "formData": {
      "nombre": "Juan Pérez",
      "puesto": "Senior Developer",
      "email": "juan.perez@example.com",
      "experiencia": "5 años"
    }
  }')
HTTP_CODE4=$(echo "$RESPONSE4" | tail -n1)
BODY4=$(echo "$RESPONSE4" | head -n-1)
echo "Actual Status: $HTTP_CODE4"
echo "Response Body:"
echo "$BODY4" | jq . 2>/dev/null || echo "$BODY4"
echo ""

# PRUEBA 5: GET /cv-drafts/load - Verify updated draft
echo "PRUEBA 5: GET /cv-drafts/load?userId=test-user-123"
echo "Expected: 200 status, response contains updated formData"
echo "---"
RESPONSE5=$(curl -s -w "\n%{http_code}" "$BASE_URL/cv-drafts/load?userId=test-user-123")
HTTP_CODE5=$(echo "$RESPONSE5" | tail -n1)
BODY5=$(echo "$RESPONSE5" | head -n-1)
echo "Actual Status: $HTTP_CODE5"
echo "Response Body:"
echo "$BODY5" | jq . 2>/dev/null || echo "$BODY5"
echo ""

# Summary
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo "PRUEBA 1 (GET non-existent): Status $HTTP_CODE1 - $([ "$HTTP_CODE1" = "200" ] && echo '✓ PASS' || echo '✗ FAIL')"
echo "PRUEBA 2 (POST create): Status $HTTP_CODE2 - $([ "$HTTP_CODE2" = "201" ] && echo '✓ PASS' || echo '✗ FAIL')"
echo "PRUEBA 3 (GET saved): Status $HTTP_CODE3 - $([ "$HTTP_CODE3" = "200" ] && echo '✓ PASS' || echo '✗ FAIL')"
echo "PRUEBA 4 (POST update): Status $HTTP_CODE4 - $([ "$HTTP_CODE4" = "200" ] && echo '✓ PASS' || echo '✗ FAIL')"
echo "PRUEBA 5 (GET updated): Status $HTTP_CODE5 - $([ "$HTTP_CODE5" = "200" ] && echo '✓ PASS' || echo '✗ FAIL')"
echo ""
echo "ENDPOINT VERIFICATION:"
echo "(1) GET /cv-drafts/load responds without 'Route not found': $([ "$HTTP_CODE1" != "404" ] && echo '✓ YES' || echo '✗ NO')"
echo "(2) POST /cv-drafts/save creates with 201: $([ "$HTTP_CODE2" = "201" ] && echo '✓ YES' || echo '✗ NO')"
echo "(3) POST /cv-drafts/save updates with 200: $([ "$HTTP_CODE4" = "200" ] && echo '✓ YES' || echo '✗ NO')"
echo "(4) Data persists correctly: $(echo "$BODY5" | grep -q 'Senior Developer' && echo '✓ YES' || echo '✗ NO')"
echo "(5) System ready for frontend use: $([ "$HTTP_CODE1" = "200" ] && [ "$HTTP_CODE2" = "201" ] && [ "$HTTP_CODE4" = "200" ] && echo '✓ YES' || echo '✗ NO')"
echo "========================================"