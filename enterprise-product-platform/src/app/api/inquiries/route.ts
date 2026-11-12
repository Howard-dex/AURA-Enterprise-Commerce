import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/redis';
import { notifyEnterpriseCrm } from '@/services/erpWebhook';

const InquirySchema = z.object({
  companyName: z.string().min(2).max(120),
  contactPerson: z.string().min(2).max(60),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6).max(30),
  cooperationType: z.enum(['BULK_PURCHASE', 'DISTRIBUTOR', 'OEM_CUSTOM', 'PRIVATE_DEPLOY']),
  estimatedQty: z.number().int().min(1),
  targetBudget: z.string().optional(),
  customNotes: z.string().max(1000).optional(),
  productId: z.string().optional()
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const allowed = await checkRateLimit(ip, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = InquirySchema.parse(body);

    const record = await prisma.b2BInquiry.create({
      data: parsed
    });

    await notifyEnterpriseCrm({
      inquiryId: record.id,
      companyName: parsed.companyName,
      contactPerson: parsed.contactPerson,
      contactPhone: parsed.contactPhone,
      contactEmail: parsed.contactEmail,
      cooperationType: parsed.cooperationType,
      estimatedQty: parsed.estimatedQty
    });

    return NextResponse.json({
      success: true,
      inquiryId: record.id,
      message: 'Enterprise inquiry recorded and dispatched to dedicated account manager.'
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
