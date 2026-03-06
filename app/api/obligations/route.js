import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const where = propertyId ? { propertyId: parseInt(propertyId) } : {};
    const obligations = await prisma.obligation.findMany({
      where,
      include: { docs: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(obligations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch obligations' }, { status: 500 });
  }
}
