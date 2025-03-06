# E-commerce Website (MERN Stack)

A full-featured e-commerce platform built with MERN (MongoDB, Express.js, React.js, Node.js) stack and TypeScript.

## Features Implemented

### Backend
- ✅ MongoDB integration with Mongoose
- ✅ Express.js server with TypeScript
- ✅ Product management system
- ✅ Admin authentication system
- ✅ Product API endpoints (CRUD operations)
- ✅ Category management
- ✅ Search functionality
- ✅ Featured products system
- ✅ Product rating system
- ✅ Hybrid product system (database + external API)

### Frontend
- ✅ React with TypeScript
- ✅ Material-UI integration
- ✅ Responsive design
- ✅ Product listing
- ✅ Product details page
- ✅ Admin dashboard
- ✅ Admin login system
- ✅ Product management interface
- ✅ Category filtering
- ✅ Featured products showcase
- ✅ Today's deals page
- ✅ Search functionality
- ✅ Product recommendations

## Project Structure

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

npm run seed

   POST http://localhost:5000/api/admin/login
   {
     "email": "admin@example.com",
     "password": "admin123"
   }


## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- CORS
- dotenv

### Frontend
- React.js
- TypeScript
- Material-UI (MUI)
- React Router DOM
- Axios
- React-Toastify

## API Endpoints

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/check` - Verify admin authentication

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/featured-products` - Get featured products

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

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a .env file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

6. Create admin account:
```bash
cd backend
npm run create-admin
```

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## Current Features

### Admin Panel
- Secure admin login
- Product management (Add, Edit, Delete)
- Featured products management
- Stock management
- Category management

### Shopping Interface
- Homepage with featured products
- Product categories
- Product search
- Product details with recommendations
- Today's deals section
- Rating display
- Stock status
- Wishlist functionality (UI only)
- Size selection for applicable products

## Next Steps
- [ ] Shopping cart implementation
- [ ] User authentication
- [ ] Order management system
- [ ] Payment integration
- [ ] User profile management
- [ ] Review system implementation
- [ ] Wishlist backend integration
- [ ] Order tracking
- [ ] Email notifications
- [ ] Admin analytics dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request