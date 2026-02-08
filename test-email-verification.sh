#!/bin/bash

# Email Verification System Test Script

API_URL="http://localhost:3001/api"

echo "🧪 Testing Email Verification System"
echo "===================================="
echo ""

# Test 1: Register a new user
echo "📝 Test 1: Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Test 2: Try to login without verification
echo "🔐 Test 2: Attempting login without email verification..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

echo "✅ Tests completed!"
echo ""
echo "📧 Next steps:"
echo "1. Check your Mailtrap inbox at https://mailtrap.io/inboxes"
echo "2. Click the verification link in the email"
echo "3. Try logging in again"
echo ""
echo "Or manually verify using the token from the database:"
echo "psql -d railway -c \"SELECT token FROM \\\"UserVerificationToken\\\" WHERE type='email_verification' ORDER BY \\\"createdAt\\\" DESC LIMIT 1;\""
