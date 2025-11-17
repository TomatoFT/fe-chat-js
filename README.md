# EduStats Web Frontend

A modern React TypeScript frontend for the EduStats educational management system, built with Vite, React Query, and comprehensive type safety.

## 🚀 Features

- **Type-Safe API Integration**: Auto-generated TypeScript types and API client from OpenAPI 3.0 schema
- **Modern React Patterns**: Built with React 18, TypeScript, and React Query for state management
- **Form Validation**: Comprehensive form validation using Zod schemas
- **Authentication**: Secure login/register with JWT token management
- **Document Management**: Upload, search, and manage educational documents
- **Chat Interface**: AI-powered chat system for educational support
- **User Management**: Complete user and role management system
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Testing**: Comprehensive test suite with Vitest and React Testing Library
- **Performance**: Optimized with debouncing, caching, and lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **API Client**: Auto-generated from OpenAPI schema
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+
- Backend API running on `http://103.167.88.66:8000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
REACT_APP_API_BASE_URL=http://103.167.88.66:8000
REACT_APP_API_TIMEOUT=30000
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── api-client/           # Auto-generated API client and types
│   ├── core/            # Core API functionality
│   ├── models/          # TypeScript models
│   ├── services/        # API service classes
│   └── types.ts         # Generated types
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── dashboard/      # Dashboard components
│   ├── forms/          # Reusable form components
│   ├── layout/         # Layout components
│   ├── management/     # Management components
│   ├── search/         # Search components
│   └── upload/         # Upload components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hooks
│   ├── useUsers.ts     # User management hooks
│   ├── useChat.ts      # Chat functionality hooks
│   ├── useDocuments.ts # Document management hooks
│   └── useDebounce.ts  # Utility hooks
├── lib/                # Utility libraries
│   ├── api-client.ts   # API client configuration
│   ├── query-client.ts # React Query configuration
│   └── validations.ts  # Zod validation schemas
├── test/               # Test utilities and setup
│   ├── setup.ts        # Test setup
│   └── test-utils.tsx  # Custom render function
└── types/              # TypeScript type definitions
```

## 🔧 API Integration

### Type-Safe API Client

The project uses auto-generated TypeScript types and API client from the OpenAPI schema:

```typescript
import { UsersService, AuthenticationService } from './api-client';

// Type-safe API calls
const users = await UsersService.getUsersUsersGet();
const token = await AuthenticationService.loginAuthLoginPost(loginData);
```

### React Query Hooks

Custom hooks provide a clean interface for API operations:

```typescript
import { useUsers, useCreateUser } from './hooks/useUsers';

function UserList() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  
  // Component logic...
}
```

### Form Validation

Zod schemas ensure type-safe form validation:

```typescript
import { loginSchema, type LoginInput } from './lib/validations';

const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

## 🔐 Authentication

The application implements secure authentication with JWT tokens:

- **Login/Register**: Secure user authentication
- **Token Management**: Automatic token storage and refresh
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent user sessions

## 📄 Document Management

Comprehensive document handling system:

- **Upload**: Multiple document types (general, staff, students, examinations)
- **Search**: Full-text search with AI-powered indexing
- **Management**: View, download, and delete documents
- **Validation**: File type and size validation

## 💬 Chat System

AI-powered chat interface:

- **Sessions**: Create and manage chat sessions
- **Real-time**: Send and receive messages
- **History**: Persistent chat history
- **Context**: Session-based conversations

## 🧪 Testing

Comprehensive test suite with:

- **Unit Tests**: Component and hook testing
- **Integration Tests**: API integration testing
- **Validation Tests**: Schema validation testing
- **Mocking**: API and external service mocking

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure the following environment variables are set:

- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_API_TIMEOUT`: API timeout in milliseconds

### Security Considerations

- API keys are never exposed to the client
- All sensitive operations are proxied through the backend
- JWT tokens are securely stored and managed
- Input validation on both client and server

## 🔧 Development

### Code Generation

The API client is auto-generated from the OpenAPI schema:

```bash
# Generate types
npx openapi-typescript src/openapi.json --output src/api-client/types.ts

# Generate API client
npx openapi-typescript-codegen --input src/openapi.json --output src/api-client --client axios
```

### Adding New Features

1. **API Integration**: Add new endpoints to the OpenAPI schema
2. **Regenerate Client**: Run the code generation commands
3. **Create Hooks**: Add custom React Query hooks
4. **Build Components**: Create React components with proper typing
5. **Add Tests**: Write comprehensive tests for new functionality

## 📚 API Endpoints

The application integrates with the following main API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### User Management
- `GET /users/` - List users
- `POST /users/` - Create user
- `GET /users/{id}` - Get user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Document Management
- `POST /documents/upload` - Upload document
- `GET /documents/` - List documents
- `GET /documents/{id}` - Get document
- `DELETE /documents/{id}` - Delete document

### Chat System
- `POST /chat/send` - Send message
- `GET /chat/sessions` - List sessions
- `POST /chat/sessions` - Create session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review the test files for examples
3. Open an issue on GitHub
4. Contact the development team

## 🔄 Updates

To update the API client when the backend schema changes:

1. Update `src/openapi.json` with the new schema
2. Run the code generation commands
3. Update any affected components
4. Run tests to ensure compatibility
5. Update documentation if needed
