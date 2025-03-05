# E-commerce Website (MERN Stack)

A full-featured e-commerce platform built with MERN (MongoDB, Express.js, React.js, Node.js) stack, similar to Amazon.

## Features

- User authentication and authorization
- Product management
- Shopping cart functionality
- Product reviews and ratings
- Admin dashboard
- Product search and filtering
- Responsive design

## Backend API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Response**: Returns user data and authentication token

#### Login User
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Response**: Returns user data and authentication token

#### Get User Profile
- **URL**: `/api/v1/auth/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: Returns user profile data

### Product Endpoints

#### Get All Products
- **URL**: `/api/v1/products`
- **Method**: `GET`
- **Authentication**: Not required
- **Response**: Returns list of all products

#### Get Single Product
- **URL**: `/api/v1/product/:id`
- **Method**: `GET`
- **Authentication**: Not required
- **Response**: Returns detailed product information

#### Create Product (Admin only)
- **URL**: `/api/v1/product/new`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 299.99,
    "category": "Electronics",
    "stock": 50,
    "seller": "Seller Name",
    "images": [
      {
        "url": "image_url"
      }
    ]
  }
  ```
- **Response**: Returns created product data

#### Update Product (Admin only)
- **URL**: `/api/v1/product/:id`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Body**: Same as create product
- **Response**: Returns updated product data

#### Delete Product (Admin only)
- **URL**: `/api/v1/product/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Admin only)
- **Response**: Returns success message

#### Create/Update Review
- **URL**: `/api/v1/review`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "rating": 4,
    "comment": "Great product!",
    "productId": "product_id"
  }
  ```
- **Response**: Returns success message

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Port number for the server (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT token generation |
| NODE_ENV | Environment mode (development/production) |

## API Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Models

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required)
- role (String, enum: ['user', 'admin'])
- address (Array of addresses)
- wishlist (Array of product references)
- createdAt (Date)

### Product Model
- name (String, required)
- description (String, required)
- price (Number, required)
- ratings (Number)
- images (Array of image URLs)
- category (String, enum of categories)
- seller (String, required)
- stock (Number, required)
- numOfReviews (Number)
- reviews (Array of review objects)
- createdAt (Date)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Middleware**: cors, morgan

## Current Status

Backend API is fully set up with:
- User authentication system
- Product management system
- Review system
- Role-based access control
- Error handling
- Security features

Next steps:
- Frontend development with React.js
- Shopping cart implementation
- Order management system
- Payment integration
- Image upload functionality
- Search and filtering features 