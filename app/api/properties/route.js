import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { units: true, obligations: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
