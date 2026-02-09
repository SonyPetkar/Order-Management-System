# Order Management System - Complete Implementation

## Project Overview

A **production-ready MERN (MongoDB, Express, React, Node.js) stack** Order Management System with authentication, complete CRUD operations, and responsive UI with Tailwind CSS.

## 🎯 Key Features Implemented

### ✅ Backend Features

1. **User Authentication**
   - User registration with email validation
   - Secure login with JWT tokens
   - Password hashing with bcryptjs
   - Role-based access control (User/Admin)
   - Protected routes with middleware

2. **Order Management**
   - Create orders with multiple items
   - Track order status (pending, confirmed, shipped, delivered, cancelled)
   - Pagination support for order listing
   - Filter orders by status
   - Admin can view all orders
   - Users can view only their orders
   - Order details with shipping and payment info

3. **Database Models**
   - User schema with email validation and password hashing
   - Order schema with items, shipping, and payment details
   - Auto-generated order numbers
   - Timestamps for created/updated dates

4. **API Endpoints**
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - User login
   - `GET /api/auth/me` - Get current user
   - `POST /api/orders` - Create new order
   - `GET /api/orders` - Get all orders (admin)
   - `GET /api/orders/my-orders` - Get user's orders
   - `GET /api/orders/:id` - Get order details
   - `PUT /api/orders/:id/status` - Update order status
   - `DELETE /api/orders/:id` - Delete order

5. **Error Handling**
   - Validation error handling
   - MongoDB error handling (duplicate keys, etc.)
   - JWT authentication errors
   - Custom error middleware
   - Detailed error messages for debugging

### ✅ Frontend Features

1. **Pages Implemented**
   - Login page with form validation
   - Registration page with password confirmation
   - Orders list page with filtering and pagination
   - Create order page with dynamic item management
   - Order detail page with complete information

2. **UI/UX Components**
   - Responsive design with Tailwind CSS
   - Professional navigation bar
   - Status badges with color coding
   - Form validation and error display
   - Loading states
   - Success/error messages
   - Clean and modern interface

3. **State Management**
   - Custom `useAuth` hook for authentication
   - Custom `useOrder` hook for order operations
   - Local storage for token persistence
   - API interceptors for automatic token injection

4. **API Integration**
   - Axios for HTTP requests
   - Automatic authorization header injection
   - Error handling and user-friendly messages
   - Request/response interceptors

## 🚀 Setup & Running

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/order-management
# JWT_SECRET=your_secure_secret_key_here

# Run development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, auto-generated),
  userId: ObjectId (ref: User),
  items: [
    {
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  status: String (pending/confirmed/shipped/delivered/cancelled),
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String (credit_card/debit_card/paypal/bank_transfer),
  paymentStatus: String (pending/completed/failed),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Never stored as plain text
   - Secure comparison for login

2. **JWT Authentication**
   - Secure token generation
   - 7-day expiration
   - Token validation on protected routes
   - Role-based authorization

3. **Input Validation**
   - Email format validation
   - Required field validation
   - Data type validation
   - Min/max length validation

4. **Authorization**
   - Users can only access their own orders
   - Admins can access all orders
   - Protected routes with middleware
   - Role-based endpoint access

## 🎨 Styling

- **Tailwind CSS** for responsive design
- Mobile-first approach
- Color-coded status indicators
- Professional gradient backgrounds
- Smooth transitions and hover effects

## 📈 Performance Optimizations

1. **Frontend**
   - Code splitting with lazy loading ready
   - Optimized re-renders with hooks
   - Efficient state management

2. **Backend**
   - Database indexing on frequently queried fields
   - Pagination to limit data transfer
   - Efficient query filters
   - Error handling for failed connections

## 🧪 Testing the Application

### Test User Creation
1. Go to register page
2. Enter: name, email, password
3. Submit and get JWT token

### Test Order Creation
1. Login with credentials
2. Click "New Order"
3. Add items with product name, quantity, price
4. Fill shipping address
5. Select payment method
6. Submit order

### Test Order Viewing
1. Go to "My Orders"
2. View orders in list with status
3. Click on order to see details
4. Filter by status to test filters

## 📝 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, message, token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, message, token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { success, user }
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Headers: Authorization: Bearer {token}
Body: { items, shippingAddress, paymentMethod, notes }
Response: { success, message, order }
```

#### Get User Orders
```
GET /api/orders/my-orders?status=pending&page=1&limit=10
Headers: Authorization: Bearer {token}
Response: { success, total, pages, currentPage, orders }
```

#### Get Order Details
```
GET /api/orders/:id
Headers: Authorization: Bearer {token}
Response: { success, order }
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id/status
Headers: Authorization: Bearer {token}
Body: { status }
Response: { success, message, order }
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/order-management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## 📦 Dependencies

### Backend
- express: REST API framework
- mongoose: MongoDB ODM
- cors: Cross-origin requests
- dotenv: Environment variables
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication

### Frontend
- react: UI framework
- vite: Build tool
- tailwindcss: CSS framework
- axios: HTTP client
- postcss & autoprefixer: CSS processing

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with MERN
- RESTful API design
- Database modeling and optimization
- Authentication and authorization
- Form validation and error handling
- Responsive UI design
- State management with hooks
- Best practices for production code

## 📄 License

ISC

## 📞 Support

For issues or questions, please refer to the inline code comments and API documentation.

---

**Built with ❤️ for Senior Full Stack Developer Assessment**
