# Sunshare - Backend Migration to Prisma & Express Server

This project has been successfully migrated from raw PostgreSQL pool connections to **Prisma ORM** with a dedicated **Express.js backend server**.

## 🚀 What's New

### ✅ Prisma ORM Integration
- **Database Schema**: Defined in `prisma/schema.prisma`
- **Type Safety**: Auto-generated TypeScript/JavaScript types
- **Query Builder**: Modern, intuitive database queries
- **Migrations**: Automatic schema synchronization

### ✅ Express.js Backend Server
- **Dedicated Server**: Located in `server/` folder
- **RESTful APIs**: Complete CRUD operations
- **Authentication**: JWT-based auth system
- **Security**: Helmet, CORS, input validation
- **Error Handling**: Centralized error management

### ✅ Enhanced Developer Experience
- **Hot Reload**: Nodemon for development
- **Concurrent Dev**: Run Next.js and Express simultaneously
- **Database Seeding**: Automated test data creation
- **API Testing**: Built-in testing utilities

## 📁 New Project Structure

```
sunshare/
├── server/                    # Express.js Backend Server
│   ├── index.js              # Main server entry point
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── users.js          # User management
│   │   └── roles.js          # Role management
│   ├── controllers/          # Business logic
│   ├── middleware/           # Authentication, validation
│   └── utils/               # Database utilities
│       └── prisma.js        # Prisma client instance
├── prisma/                  # Prisma Configuration
│   ├── schema.prisma        # Database schema
│   └── seed.js             # Database seeding
├── src/lib/
│   └── prisma-db.js        # Legacy compatibility layer
└── ...
```

## 🛠 Setup Instructions

### 1. Install Dependencies
All dependencies have been installed:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI tools
- `express` - Web server framework
- `cors`, `helmet`, `morgan` - Security & logging
- `nodemon`, `concurrently` - Development tools

### 2. Database Configuration
Environment variables are configured in `.env` and `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:Admin@123@localhost:5432/sunshare_db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Database Setup
```bash
# Run Prisma Migration 
npx prisma migrate dev --name init

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with default data
npm run prisma:seed
```

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
# Run both Next.js frontend and Express backend
npm run dev:all
```

### Separate Processes
```bash
# Run Next.js frontend (http://localhost:3000)
npm run dev

# Run Express backend (http://localhost:5000)
npm run server:dev
```

### Production Mode
```bash
# Build Next.js
npm run build

# Start Next.js
npm start

# Start Express server
npm run server
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - List all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/password` - Change password

### Roles
- `GET /api/roles` - List all roles (paginated)
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role
- `GET /api/roles/active/list` - Get active roles

### Health Check
- `GET /health` - Server health status

## 🔐 Default Test Accounts

After running `npm run prisma:seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@sunshare.com | admin123 | admin |
| manager@sunshare.com | password123 | manager |
| user@sunshare.com | password123 | user |
| customer@sunshare.com | password123 | customer |

## 🗄 Database Operations

### Using Prisma Client (Recommended)
```javascript
import prisma from '../server/utils/prisma.js';

// Create user
const user = await prisma.user.create({
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: hashedPassword,
    userRole: 'user'
  }
});

// Find users
const users = await prisma.user.findMany({
  where: {
    status: 1
  },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true
  }
});
```

### Legacy Compatibility
The old database code will continue to work through the compatibility layer in `src/lib/prisma-db.js`.

## 🔧 Prisma Commands

```bash
# Generate client after schema changes
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database (careful!)
npm run prisma:reset

# Seed database
npm run prisma:seed
```

## 🛡 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Configured for development/production
- **Helmet Security**: HTTP security headers
- **Input Validation**: Request data validation
- **Error Handling**: Secure error responses

## 📊 Benefits

### 🎯 Developer Experience
- **Type Safety**: Prisma generates types automatically
- **IntelliSense**: Full IDE support and autocomplete
- **Query Builder**: Intuitive, readable database queries
- **Schema Management**: Version-controlled database schema

### ⚡ Performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Prisma's optimized query engine
- **Lazy Loading**: Load only what you need
- **Caching**: Built-in query result caching

### 🔒 Security
- **SQL Injection Protection**: Parameterized queries
- **Type Validation**: Runtime type checking
- **Access Control**: Role-based permissions
- **Audit Trail**: Built-in logging

## 🚨 Migration Notes

### From Old System
- Old `src/lib/db.js` is replaced by Prisma client
- Raw SQL queries are discouraged (use Prisma methods)
- Connection pooling is handled automatically
- Transaction handling is simplified

### Breaking Changes
- Import statements changed to use Prisma client
- Query syntax is different (more intuitive)
- Error handling structure updated

## 🤝 Contributing

When adding new database operations:
1. Update `prisma/schema.prisma` if schema changes are needed
2. Run `npm run prisma:generate` to update client
3. Use Prisma methods instead of raw SQL
4. Add proper error handling and validation
5. Test endpoints with authentication

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Authentication](https://jwt.io/introduction)

---

**🎉 Your Sunshare application is now running with modern Prisma ORM and a dedicated Express.js backend server!**