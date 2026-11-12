import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const line = searchParams.get('line') || 'CONSUMER_FLAGSHIP';
  const cacheKey = `products:catalog:${line}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ source: 'redis-cache', data: JSON.parse(cached) });
    }

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' }
    });

    await redis.set(cacheKey, JSON.stringify(products), 'EX', 300);
    return NextResponse.json({ source: 'database', data: products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
  }
}
