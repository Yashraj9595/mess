# Mess App - Frontend Authentication System

A comprehensive authentication frontend system built with Next.js, TypeScript, and Tailwind CSS for the Mess App platform.

## Features

### 🔐 Authentication Features
- **User Registration** with OTP verification
- **User Login** with email and password
- **Password Reset** with OTP verification
- **Role-based Access Control** (User, Mess Owner, Admin)
- **Profile Management** with update capabilities
- **Secure Token Management** with JWT
- **Responsive Design** for all devices

### 🎨 UI/UX Features
- **Modern Design** with Tailwind CSS
- **Mobile-First** responsive approach
- **Beautiful Welcome Page** with feature showcase
- **Role-specific Dashboards** with relevant information
- **Intuitive Navigation** with role-based menus
- **Loading States** and error handling
- **Form Validation** with real-time feedback

### 🛡️ Security Features
- **Protected Routes** with role-based access
- **Authentication Guards** for sensitive pages
- **Secure Token Storage** in localStorage
- **Input Validation** and sanitization
- **Error Handling** with user-friendly messages

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── forgot-password/          # Password reset page
│   ├── dashboard/                # Main dashboard (redirects based on role)
│   ├── user/dashboard/           # User dashboard
│   ├── mess-owner/dashboard/     # Mess owner dashboard
│   ├── admin/dashboard/          # Admin dashboard
│   └── profile/                  # User profile page
├── components/
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── RegisterForm.tsx      # Registration form with OTP
│   │   ├── ForgotPasswordForm.tsx # Password reset form
│   │   ├── WelcomePage.tsx       # Landing page
│   │   ├── Navigation.tsx        # Role-based navigation
│   │   ├── ProfilePage.tsx       # Profile management
│   │   └── ProtectedRoute.tsx    # Route protection component
│   └── ui/                       # UI components (shadcn/ui)
├── hooks/
│   └── useAuth.ts                # Authentication hook and context
├── lib/
│   └── authService.ts            # API service for authentication
└── README.md                     # This file
```

## Components Overview

### Authentication Components

#### `LoginForm.tsx`
- Email and password login
- Show/hide password functionality
- Error handling and validation
- Links to registration and password reset

#### `RegisterForm.tsx`
- Multi-step registration (form + OTP verification)
- Role selection (User, Mess Owner)
- Password confirmation
- OTP verification with resend functionality

#### `ForgotPasswordForm.tsx`
- Multi-step password reset (email + OTP + new password)
- Email verification
- OTP verification
- New password setup

#### `WelcomePage.tsx`
- Beautiful landing page
- Feature showcase
- Call-to-action buttons
- Responsive design

#### `Navigation.tsx`
- Role-based navigation menu
- User dropdown with profile and logout
- Mobile-responsive hamburger menu
- Active page highlighting

#### `ProfilePage.tsx`
- Profile information management
- Security settings (password change)
- Account information display
- Tabbed interface

#### `ProtectedRoute.tsx`
- Route protection based on authentication
- Role-based access control
- Automatic redirects
- Loading states

### Hooks and Services

#### `useAuth.ts`
- Authentication context provider
- User state management
- Token management
- Authentication methods (login, register, logout, etc.)

#### `authService.ts`
- API communication with backend
- HTTP request handling
- Error handling
- Response formatting

## User Roles and Access

### 👤 User
- View personal meal information
- Rate meals and provide feedback
- Update profile information
- View meal schedules

### 👨‍🍳 Mess Owner
- Manage mess operations
- Create and update menus
- Manage user subscriptions
- View analytics and reports

### 👑 Admin
- System-wide user management
- Mess owner management
- Platform analytics
- System settings and configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## API Integration

The frontend communicates with the backend through the `authService.ts` file. All API endpoints are prefixed with `/api/auth/` and include:

- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with OTP
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Styling and Design

The application uses:
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **Responsive design** principles
- **Mobile-first** approach

## Security Considerations

- All sensitive routes are protected
- JWT tokens are stored securely
- Input validation on all forms
- Error handling prevents information leakage
- Role-based access control implemented

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- Fully responsive design
- Touch-friendly interfaces
- Optimized for mobile devices
- PWA capabilities (installable)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Implement proper error handling
4. Add loading states for async operations
5. Test on multiple devices and browsers
6. Follow the established naming conventions

## License

This project is part of the Mess App platform. See the main project license for details.
