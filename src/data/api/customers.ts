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
