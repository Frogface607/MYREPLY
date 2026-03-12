const isProd = process.env.NODE_ENV === 'production';

function maskId(id: string | undefined | null): string {
  if (!id) return '[empty]';
  if (!isProd) return id;
  if (id.length <= 8) return '***';
  return id.slice(0, 4) + '...' + id.slice(-4);
}

export const logger = {
  info(context: string, message: string, data?: Record<string, unknown>) {
    if (isProd) {
      console.log(JSON.stringify({ level: 'info', ctx: context, msg: message, ...sanitize(data) }));
    } else {
      console.log(`[${context}] ${message}`, data ?? '');
    }
  },

  warn(context: string, message: string, data?: Record<string, unknown>) {
    if (isProd) {
      console.warn(JSON.stringify({ level: 'warn', ctx: context, msg: message, ...sanitize(data) }));
    } else {
      console.warn(`[${context}] ${message}`, data ?? '');
    }
  },

  error(context: string, message: string, error?: unknown) {
    const errorInfo = error instanceof Error
      ? { errMsg: error.message, stack: isProd ? undefined : error.stack }
      : { errMsg: String(error) };

    if (isProd) {
      console.error(JSON.stringify({ level: 'error', ctx: context, msg: message, ...errorInfo }));
    } else {
      console.error(`[${context}] ${message}`, error);
    }
  },

  /** Mask a user/payment/subscription ID for safe logging */
  mask: maskId,
};

function sanitize(data?: Record<string, unknown>): Record<string, unknown> {
  if (!data || !isProd) return data ?? {};
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (/user.?id|payment.?id|subscription.?id|email/i.test(key) && typeof value === 'string') {
      clean[key] = maskId(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}
