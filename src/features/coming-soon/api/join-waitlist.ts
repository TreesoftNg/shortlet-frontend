export type WaitlistSuccess = {
  message: string;
};

type ApiSuccessEnvelope = {
  success: true;
  data: null;
  message: string;
};

type ApiErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export class WaitlistApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'WaitlistApiError';
    this.status = status;
    this.code = code;
  }
}

function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) {
    throw new WaitlistApiError(
      'Waitlist is temporarily unavailable. Please try again later.',
      503,
      'CONFIG_MISSING',
    );
  }
  return base.replace(/\/$/, '');
}

function tenantSlug(): string {
  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim().toLowerCase();
  if (!slug) {
    throw new WaitlistApiError(
      'Waitlist is temporarily unavailable. Please try again later.',
      503,
      'CONFIG_MISSING',
    );
  }
  return slug;
}

export async function joinWaitlist(email: string): Promise<WaitlistSuccess> {
  const url = `${apiBaseUrl()}/api/v1/public/waitlist`;
  const slug = tenantSlug();

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Tenant-Slug': slug,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source: 'coming-soon',
      }),
    });
  } catch {
    throw new WaitlistApiError(
      'Could not reach the server. Check your connection and try again.',
      0,
      'NETWORK_ERROR',
    );
  }

  let body: ApiSuccessEnvelope | ApiErrorEnvelope | null = null;
  try {
    body = (await response.json()) as ApiSuccessEnvelope | ApiErrorEnvelope;
  } catch {
    body = null;
  }

  if (response.ok && body && body.success === true) {
    return {
      message:
        body.message ||
        "You're on the waitlist. We'll let you know when the website goes live.",
    };
  }

  const errorMessage =
    body && body.success === false
      ? body.error.message
      : 'Something went wrong. Please try again.';
  const errorCode =
    body && body.success === false ? body.error.code : undefined;

  throw new WaitlistApiError(errorMessage, response.status, errorCode);
}
