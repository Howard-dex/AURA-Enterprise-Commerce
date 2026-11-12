import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['zh-CN', 'en-US'];
const DEFAULT_LOCALE = 'zh-CN';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. 语言偏好探测与 Cookie 注入
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (!cookieLocale || !SUPPORTED_LOCALES.includes(cookieLocale)) {
    const acceptLang = request.headers.get('accept-language') || '';
    const detected = acceptLang.includes('en') ? 'en-US' : DEFAULT_LOCALE;
    response.cookies.set('NEXT_LOCALE', detected, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  // 2. A/B 测试分流桶 (用于衡量商品落地页 Hero 转化率)
  if (!request.cookies.get('AB_BUCKET')) {
    const bucket = Math.random() < 0.5 ? 'variant_A_video' : 'variant_B_3d_configurator';
    response.cookies.set('AB_BUCKET', bucket, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }

  // 3. 安全追踪 Request ID
  response.headers.set('X-Request-Id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
