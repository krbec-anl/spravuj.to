import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const where = propertyId ? { propertyId: parseInt(propertyId) } : {};
    const units = await prisma.unit.findMany({
      where,
      include: { property: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}
