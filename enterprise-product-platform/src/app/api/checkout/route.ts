import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(5),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantInfo: z.string(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().positive()
    })
  ).min(1)
});

export async function POST(req: NextRequest) {
  try {
    const payload = CheckoutSchema.parse(await req.json());
    const subtotal = payload.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const discountAmount = payload.couponCode === 'AURA2026' ? Number((subtotal * 0.05).toFixed(2)) : 0;
    const totalAmount = subtotal - discountAmount;

    const orderNo = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNo,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        shippingAddress: payload.shippingAddress,
        subtotal,
        discountAmount,
        totalAmount,
        couponCode: payload.couponCode,
        items: {
          create: payload.items.map((i) => ({
            productId: i.productId,
            variantInfo: i.variantInfo,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          }))
        }
      }
    });

    return NextResponse.json({
      success: true,
      orderNo: order.orderNo,
      totalAmount: order.totalAmount
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
  }
}
