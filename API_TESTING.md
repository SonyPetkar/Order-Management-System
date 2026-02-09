# API Testing Guide - cURL & Postman

## Quick Start - Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Create an Order

```bash
# Save token from login response
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "productName": "Laptop",
        "quantity": 1,
        "price": 999.99
      },
      {
        "productName": "Mouse",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "notes": "Please deliver before 5 PM"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "65f...",
    "orderNumber": "ORD-1706...",
    "userId": "65f...",
    "items": [
      {
        "productName": "Laptop",
        "quantity": 1,
        "price": 999.99,
        "subtotal": 999.99
      },
      {
        "productName": "Mouse",
        "quantity": 2,
        "price": 29.99,
        "subtotal": 59.98
      }
    ],
    "totalAmount": 1059.97,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": {...},
    "createdAt": "2024-02-08T..."
  }
}
```

### 4. Get User Orders

```bash
TOKEN="your_jwt_token_here"

curl -X GET "http://localhost:5000/api/orders/my-orders?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "total": 5,
  "pages": 1,
  "currentPage": 1,
  "orders": [
    {
      "_id": "65f...",
      "orderNumber": "ORD-1706...",
      "totalAmount": 1059.97,
      "status": "pending",
      "createdAt": "2024-02-08T..."
    }
  ]
}
```

### 5. Get Order Details

```bash
TOKEN="your_jwt_token_here"
ORDER_ID="65f_order_id_here"

curl -X GET http://localhost:5000/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Update Order Status (Admin Only)

```bash
TOKEN="admin_jwt_token_here"
ORDER_ID="65f_order_id_here"

curl -X PUT http://localhost:5000/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

### 7. Filter Orders by Status

```bash
TOKEN="your_jwt_token_here"

curl -X GET "http://localhost:5000/api/orders/my-orders?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Delete Order

```bash
TOKEN="your_jwt_token_here"
ORDER_ID="65f_order_id_here"

curl -X DELETE http://localhost:5000/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Order not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Postman Collection

Import this as a Postman collection:

1. **Create new collection**: "Order Management System"

2. **Set base URL variable**: `{{baseUrl}}` = `http://localhost:5000`

3. **Set token variable**: `{{token}}` = (copy from login response)

4. **Create requests:**

| Method | Endpoint | Headers | Body |
|--------|----------|---------|------|
| POST | {{baseUrl}}/api/auth/register | Content-Type: application/json | { name, email, password } |
| POST | {{baseUrl}}/api/auth/login | Content-Type: application/json | { email, password } |
| GET | {{baseUrl}}/api/auth/me | Authorization: Bearer {{token}} | - |
| POST | {{baseUrl}}/api/orders | Authorization: Bearer {{token}}, Content-Type: application/json | { items, shippingAddress, paymentMethod, notes } |
| GET | {{baseUrl}}/api/orders/my-orders | Authorization: Bearer {{token}} | - |
| GET | {{baseUrl}}/api/orders/:id | Authorization: Bearer {{token}} | - |
| PUT | {{baseUrl}}/api/orders/:id/status | Authorization: Bearer {{token}}, Content-Type: application/json | { status } |
| DELETE | {{baseUrl}}/api/orders/:id | Authorization: Bearer {{token}} | - |

## Testing Workflow

### Complete Order Flow Test

1. **Register** → Get token
2. **Create Order** → Get order ID
3. **Get Orders** → Verify order in list
4. **Get Order Details** → Verify all information
5. **Filter Orders** → Test status filtering
6. **Update Status** → Test admin functionality
7. **Delete Order** → Test deletion

## Common Test Scenarios

### Scenario 1: New User Order
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"test123"}'

# 2. Extract token and create order
# 3. Verify order in my-orders endpoint
```

### Scenario 2: Multiple Items Order
```bash
# Create order with 3 different products
{
  "items": [
    {"productName":"Item1","quantity":2,"price":50},
    {"productName":"Item2","quantity":1,"price":100},
    {"productName":"Item3","quantity":5,"price":10}
  ],
  "shippingAddress":{...},
  "paymentMethod":"paypal"
}
# Total should be: 2*50 + 1*100 + 5*10 = 250
```

### Scenario 3: Filter by Status
```bash
# Create order (status: pending)
# Create another order
# Filter by pending status
# Verify only pending orders returned
```

## Validation Rules

### Order Validation
- At least one item required
- Payment method is required
- Quantity must be >= 1
- Price must be >= 0
- Total amount calculated correctly

### User Validation
- Email format must be valid
- Password minimum 6 characters
- Email must be unique
- Name required

### Address Validation
- All fields are optional but recommended

## Response Time Targets
- Auth endpoints: < 200ms
- Order creation: < 300ms
- List operations: < 500ms
- Detail endpoints: < 200ms

## Rate Limiting (if needed)
Current implementation has no rate limiting. Consider adding for production:
- 100 requests/minute per IP
- 1000 requests/minute per authenticated user

---

**Note**: Replace `http://localhost:5000` with your actual server URL for production testing.
