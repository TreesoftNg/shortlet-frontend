export type AuthMode = 'signin' | 'signup';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarInitials: string;
};

/** Fixture for unit tests — not used for live sign-in. */
export const sampleAuthUser: AuthUser = {
  id: 'usr_001',
  email: 'temi@example.com',
  firstName: 'Temitope',
  lastName: 'Aladesiun',
  username: 'aladesiun.t',
  avatarInitials: 'AT',
};
