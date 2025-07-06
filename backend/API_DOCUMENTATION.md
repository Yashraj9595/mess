# Mess App Authentication API Documentation

## Overview

The Mess App Authentication API provides secure user authentication with OTP verification, role-based access control, and comprehensive error handling. All endpoints return JSON responses and include proper HTTP status codes.

**Base URL:** `http://localhost:5000/api`

## Authentication Flow

1. **Registration**: User registers with email → OTP sent to email
2. **Verification**: User enters OTP → Account verified
3. **Login**: User logs in with email/password → JWT token returned
4. **Protected Routes**: Include JWT token in Authorization header

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "resolution": "How to fix the error"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```

## Endpoints

### 1. User Registration

**POST** `/auth/register`

Register a new user account. Sends OTP to email for verification.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user",
  "phone": "+1234567890"
}
```

#### Field Validation
- `name`: Required, 2-50 characters, letters and spaces only
- `email`: Required, valid email format, unique
- `password`: Required, min 6 chars, must contain uppercase, lowercase, and number
- `role`: Optional, enum: ['user', 'mess-owner', 'admin'], default: 'user'
- `phone`: Optional, valid phone number format

#### Response
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Error Codes
- `DUPLICATE_001`: Email already registered
- `VALIDATION_001`: Validation failed
- `EMAIL_001`: Email sending failed

---

### 2. OTP Verification

**POST** `/auth/verify`

Verify the OTP sent during registration to activate the account.

#### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Field Validation
- `email`: Required, valid email format
- `otp`: Required, exactly 6 digits

#### Response
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login.",
  "data": {
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Error Codes
- `USER_001`: User not found
- `VERIFICATION_001`: Account already verified
- `AUTH_003`: Invalid or expired OTP
- `VALIDATION_001`: Validation failed

---

### 3. User Login

**POST** `/auth/login`

Authenticate user and return JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Field Validation
- `email`: Required, valid email format
- `password`: Required, non-empty

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "phone": "+1234567890",
      "profilePicture": null,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Account not verified
- `AUTH_005`: Account deactivated
- `VALIDATION_001`: Validation failed

---

### 4. Get User Profile

**GET** `/auth/me`

Get current user's profile information.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "phone": "+1234567890",
      "profilePicture": null,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Codes
- `AUTH_001`: Invalid or missing token
- `AUTH_004`: Token expired

---

### 5. Update User Profile

**PUT** `/auth/me`

Update current user's profile information.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

#### Field Validation
- `name`: Optional, 2-50 characters, letters and spaces only
- `phone`: Optional, valid phone number format

#### Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Smith",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "phone": "+1987654321",
      "profilePicture": null,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Codes
- `AUTH_001`: Invalid or missing token
- `AUTH_004`: Token expired
- `VALIDATION_001`: Validation failed

---

### 6. Change Password

**PUT** `/auth/change-password`

Change user's password (requires current password).

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass123"
}
```

#### Field Validation
- `currentPassword`: Required, non-empty
- `newPassword`: Required, min 6 chars, must contain uppercase, lowercase, and number

#### Response
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Codes
- `AUTH_001`: Invalid or missing token, or incorrect current password
- `AUTH_004`: Token expired
- `VALIDATION_001`: Validation failed

---

### 7. Forgot Password

**POST** `/auth/forgot-password`

Request password reset. Sends OTP to email.

#### Request Body
```json
{
  "email": "john@example.com"
}
```

#### Field Validation
- `email`: Required, valid email format

#### Response
```json
{
  "success": true,
  "message": "Password reset code sent to your email"
}
```

#### Error Codes
- `AUTH_002`: Account not verified
- `VALIDATION_001`: Validation failed
- `EMAIL_001`: Email sending failed

---

### 8. Reset Password

**POST** `/auth/reset-password`

Reset password using OTP received via email.

#### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

#### Field Validation
- `email`: Required, valid email format
- `otp`: Required, exactly 6 digits
- `newPassword`: Required, min 6 chars, must contain uppercase, lowercase, and number

#### Response
```json
{
  "success": true,
  "message": "Password updated successfully. You can now login with your new password."
}
```

#### Error Codes
- `USER_001`: User not found
- `AUTH_003`: Invalid or expired OTP
- `VALIDATION_001`: Validation failed

---

### 9. Resend OTP

**POST** `/auth/resend-otp`

Resend OTP for account verification.

#### Request Body
```json
{
  "email": "john@example.com"
}
```

#### Field Validation
- `email`: Required, valid email format

#### Response
```json
{
  "success": true,
  "message": "New verification code sent to your email"
}
```

#### Error Codes
- `USER_001`: User not found
- `VERIFICATION_001`: Account already verified
- `VALIDATION_001`: Validation failed
- `EMAIL_001`: Email sending failed

---

## Error Codes Reference

| Code | HTTP Status | Meaning | Resolution |
|------|-------------|---------|------------|
| AUTH_001 | 401 | Invalid credentials/token | Check credentials or reauthenticate |
| AUTH_002 | 403 | Account not verified | Complete email verification |
| AUTH_003 | 400 | Invalid/expired OTP | Request new OTP |
| AUTH_004 | 401 | Token expired | Reauthenticate |
| AUTH_005 | 403 | Unauthorized role/account deactivated | Contact administrator |
| VALIDATION_001 | 400 | Validation failed | Check input fields |
| DUPLICATE_001 | 409 | Email already exists | Use different email |
| USER_001 | 404 | User not found | Check email address |
| VERIFICATION_001 | 400 | Account already verified | Proceed to login |
| RATE_LIMIT_001 | 429 | Too many requests | Wait and try again |
| RATE_LIMIT_002 | 429 | Too many auth attempts | Wait 15 minutes |
| EMAIL_001 | 500 | Email sending failed | Try again later |
| RESOURCE_001 | 404 | Resource not found | Check resource ID |
| INTERNAL_001 | 500 | Internal server error | Try again later |

## Rate Limiting

- **Sensitive endpoints** (register, verify, forgot-password, reset-password, resend-otp): 5 requests per minute
- **Authentication endpoints** (login): 10 requests per 15 minutes

## Security Headers

The API includes the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## CORS Configuration

- **Origin**: Configurable via `FRONTEND_URL` environment variable
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With
- **Credentials**: true

## JWT Token Format

```json
{
  "id": "user_id",
  "role": "user_role",
  "iat": 1642234567,
  "exp": 1642320967
}
```

**Token Expiration**: 24 hours (configurable)

## Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Mobile Optimization

### Response Headers
- `Content-Type: application/json; charset=utf-8`
- `Cache-Control: no-store`
- `Access-Control-Allow-Origin: *`

### Error Response Format
Consistent error structure with human-readable messages and resolution steps.

### Minimal Payload
Responses are optimized for mobile with minimal data transfer.

## Support

For API support and questions, please refer to the main README.md file or contact the development team. 