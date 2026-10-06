import { API_PROXY_PREFIX, getTenantSlug } from '@/data/config';

export type ApiErrorBody = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  meta?: { requestId?: string };
};

export type ApiSuccessBody<T> = {
  success?: true;
  data?: T;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(options: {
    status: number;
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type HttpOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  /** Guest booking access token from create-booking (x-booking-token). */
  bookingToken?: string | null;
  headers?: Record<string, string>;
};

function apiUrl(path: string): string {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${API_PROXY_PREFIX}${normalised}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function unwrapApiData<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return payload as T;
}

function toApiError(status: number, payload: unknown): ApiError {
  if (isRecord(payload) && isRecord(payload.error)) {
    const error = payload.error;
    const meta = isRecord(payload.meta) ? payload.meta : undefined;
    return new ApiError({
      status,
      code: typeof error.code === 'string' ? error.code : 'UNKNOWN',
      message:
        typeof error.message === 'string'
          ? error.message
          : 'Request failed',
      requestId: typeof meta?.requestId === 'string' ? meta.requestId : undefined,
      details: error.details,
    });
  }

  return new ApiError({
    status,
    code: 'UNKNOWN',
    message: `Request failed (${status})`,
  });
}

export type ApiListMeta = {
  requestId?: string;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

async function requestJson(
  path: string,
  options: HttpOptions = {},
): Promise<{ ok: boolean; status: number; payload: unknown }> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-tenant-slug': getTenantSlug(),
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  if (options.bookingToken) {
    headers['x-booking-token'] = options.bookingToken;
  }

  const response = await fetch(apiUrl(path), {
    method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  return {
    ok: response.ok,
    status: response.status,
    payload: await parseBody(response),
  };
}

export async function http<T = unknown>(
  path: string,
  options: HttpOptions = {},
): Promise<T> {
  const { ok, status, payload } = await requestJson(path, options);
  if (!ok) throw toApiError(status, payload);
  return unwrapApiData<T>(payload);
}

/** Same as `http`, but keeps list pagination fields from the envelope `meta`. */
export async function httpWithMeta<T = unknown>(
  path: string,
  options: HttpOptions = {},
): Promise<{ data: T; meta: ApiListMeta }> {
  const { ok, status, payload } = await requestJson(path, options);
  if (!ok) throw toApiError(status, payload);
  const data = unwrapApiData<T>(payload);
  const meta =
    isRecord(payload) && isRecord(payload.meta)
      ? (payload.meta as ApiListMeta)
      : {};
  return { data, meta };
}
