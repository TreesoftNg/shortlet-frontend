import { http } from '@/data/api/http';

export type CreateCustomerAccountInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type VerifyEmailOtpInput = {
  email: string;
  otp: string;
};

export type ResendEmailOtpInput = {
  email: string;
};

export type CustomerLoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  email: string;
  otp: string;
  newPassword: string;
};

export type CustomerUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CustomerLoginResult = {
  tokenType?: string;
  accessToken: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  profile?: {
    user?: CustomerUserDto;
  } & Partial<CustomerUserDto>;
  user?: CustomerUserDto;
};

/** POST /api/v1/create-account — emails a verification code. */
export function createCustomerAccount(input: CreateCustomerAccountInput) {
  return http<unknown>('/api/v1/create-account', { body: input });
}

/** POST /api/v1/verify-otp */
export function verifyCustomerOtp(input: VerifyEmailOtpInput) {
  return http<unknown>('/api/v1/verify-otp', { body: input });
}

/** POST /api/v1/resend-otp */
export function resendCustomerOtp(input: ResendEmailOtpInput) {
  return http<unknown>('/api/v1/resend-otp', { body: input });
}

/** POST /api/v1/login — guest sign-in after email is verified. */
export function loginCustomer(input: CustomerLoginInput) {
  return http<CustomerLoginResult>('/api/v1/login', { body: input });
}

export type RefreshSessionInput = {
  refreshToken: string;
};

export type RefreshSessionResult = {
  accessToken: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
};

/** POST /api/v1/refresh — rotate guest access + refresh tokens. */
export function refreshCustomerSession(input: RefreshSessionInput) {
  return http<RefreshSessionResult>('/api/v1/refresh', { body: input });
}

/** POST /api/v1/forgot-password — emails a reset code when the account exists. */
export function forgotCustomerPassword(input: ForgotPasswordInput) {
  return http<unknown>('/api/v1/forgot-password', { body: input });
}

/** POST /api/v1/reset-password — set a new password with the email code. */
export function resetCustomerPassword(input: ResetPasswordInput) {
  return http<unknown>('/api/v1/reset-password', { body: input });
}
