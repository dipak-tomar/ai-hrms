# Contributing to AI HRMS

Thank you for your interest in contributing to the AI HRMS project! This document outlines our development standards and contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Security Guidelines](#security-guidelines)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Docker and Docker Compose
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-hrms
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Frontend  
   cp frontend/env.example frontend/.env
   ```

4. **Start development environment**
   ```bash
   npm run dev
   ```

5. **Set up database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma seed
   ```

## Code Standards

### TypeScript Guidelines

- **Always use TypeScript** - No plain JavaScript files
- **Strict type checking** - Enable all TypeScript strict mode options
- **Explicit return types** - For all public functions and methods
- **No `any` types** - Use proper typing or `unknown` with type guards
- **Consistent imports** - Use `import type` for type-only imports

```typescript
// ✅ Good
import type { User } from '../types/user';
import { validateUser } from '../utils/validation';

export function createUser(userData: CreateUserRequest): Promise<User> {
  return validateUser(userData);
}

// ❌ Bad
import { User } from '../types/user';

export function createUser(userData: any) {
  return validateUser(userData);
}
```

### React Guidelines

- **Functional components only** - No class components
- **Custom hooks** - Extract reusable logic into custom hooks
- **Proper prop typing** - Use interfaces for component props
- **Error boundaries** - Implement error boundaries for critical components
- **Accessibility** - Follow WCAG 2.1 AA guidelines

```tsx
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps): JSX.Element {
  const handleEdit = useCallback(() => {
    onEdit(user.id);
  }, [user.id, onEdit]);

  return (
    <div className={clsx('user-card', className)} role="article">
      <h3>{user.name}</h3>
      <button 
        onClick={handleEdit}
        aria-label={`Edit user ${user.name}`}
      >
        Edit
      </button>
    </div>
  );
}
```

### Backend Guidelines

- **Clean Architecture** - Separate controllers, services, and repositories
- **Input validation** - Validate all inputs using Zod schemas
- **Error handling** - Use consistent error response format
- **Security** - Follow OWASP security guidelines
- **Documentation** - Document all API endpoints

```typescript
// ✅ Good
export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
        return;
      }
      
      throw error; // Let error middleware handle it
    }
  }
}
```

### CSS/Styling Guidelines

- **Tailwind CSS first** - Use utility classes primarily
- **Custom CSS sparingly** - Only when Tailwind is insufficient
- **Responsive design** - Mobile-first approach
- **Dark mode support** - Consider dark mode in design
- **Consistent spacing** - Use Tailwind's spacing scale

```tsx
// ✅ Good
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Dashboard
  </h2>
</div>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `security`: Security improvements

### Examples

```bash
feat(auth): add OAuth2 authentication
fix(api): resolve user creation validation error
docs(readme): update installation instructions
test(user): add unit tests for user service
security(api): implement rate limiting for auth endpoints
```

### Pre-commit Hooks

Pre-commit hooks will automatically:
- Run ESLint and fix auto-fixable issues
- Format code with Prettier
- Run type checking
- Check for secrets in code

## Pull Request Process

### Before Creating a PR

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write tests** - Ensure good test coverage
3. **Run quality checks**
   ```bash
   # Frontend
   cd frontend
   npm run lint
   npm run type-check
   npm test
   
   # Backend
   cd backend
   npm run lint
   npm run type-check
   npm test
   ```

4. **Update documentation** - If needed

### PR Requirements

- [ ] **Clear description** - Explain what and why
- [ ] **Tests included** - Unit and integration tests
- [ ] **Documentation updated** - If applicable
- [ ] **No breaking changes** - Unless discussed
- [ ] **Security review** - For security-related changes
- [ ] **Performance impact** - Consider performance implications

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Security
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization verified

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Testing Requirements

### Test Coverage

- **Minimum coverage**: 80%
- **Critical paths**: 100% coverage
- **New features**: Must include tests

### Testing Strategy

#### Frontend Testing

```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('should render user information', () => {
    render(<UserCard user={mockUser} onEdit={jest.fn()} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

#### Backend Testing

```typescript
// Service testing
describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    userService = new UserService(mockPrisma);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await userService.createUser(userData);

      expect(result).toMatchObject(userData);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: userData
      });
    });
  });
});
```

## Security Guidelines

### Input Validation

- **Always validate inputs** - Use Zod schemas
- **Sanitize data** - Remove potentially harmful content
- **Validate file uploads** - Check file types and sizes

### Authentication & Authorization

- **JWT best practices** - Short expiration times, secure secrets
- **Role-based access** - Check permissions for all endpoints
- **Rate limiting** - Implement for all public endpoints

### Data Protection

- **Encrypt sensitive data** - Use appropriate encryption
- **Secure environment variables** - Never commit secrets
- **HTTPS only** - All production traffic must use HTTPS

### Security Checklist

- [ ] Input validation implemented
- [ ] Authentication required
- [ ] Authorization checked
- [ ] Rate limiting applied
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak information
- [ ] Dependencies updated and scanned

## Documentation

### Code Documentation

- **JSDoc comments** - For all public functions
- **README updates** - Keep documentation current
- **API documentation** - Document all endpoints
- **Architecture decisions** - Document significant decisions

### Example JSDoc

```typescript
/**
 * Creates a new user in the system
 * @param userData - The user data to create
 * @param userData.name - The user's full name
 * @param userData.email - The user's email address
 * @returns Promise that resolves to the created user
 * @throws {ValidationError} When user data is invalid
 * @throws {ConflictError} When email already exists
 * @example
 * ```typescript
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * ```
 */
export async function createUser(userData: CreateUserRequest): Promise<User> {
  // Implementation
}
```

## Performance Guidelines

### Frontend Performance

- **Bundle size** - Keep bundles under 250KB
- **Lazy loading** - Use dynamic imports for routes
- **Image optimization** - Optimize images and use WebP
- **Caching** - Implement proper caching strategies

### Backend Performance

- **Database queries** - Optimize N+1 queries
- **Caching** - Use Redis for frequently accessed data
- **Response times** - Keep API responses under 200ms
- **Memory usage** - Monitor and optimize memory usage

## Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Security Issues** - Email security@company.com
- **Documentation** - Check docs/ directory first

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Annual contributor report

Thank you for contributing to AI HRMS! 🚀