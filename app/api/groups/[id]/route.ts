import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/groups/[id] - Get a single group
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: params.id
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/groups/[id] - Update a group
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    // Validate required fields if they are present
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (json.startTime && !timeRegex.test(json.startTime)) {
      return NextResponse.json(
        { error: 'Invalid startTime format. Use HH:mm format.' },
        { status: 400 }
      );
    }

    if (json.endTime && !timeRegex.test(json.endTime)) {
      return NextResponse.json(
        { error: 'Invalid endTime format. Use HH:mm format.' },
        { status: 400 }
      );
    }

    if (json.day1 && !validDays.includes(json.day1)) {
      return NextResponse.json(
        { error: 'Invalid day1. Must be a valid day of the week.' },
        { status: 400 }
      );
    }

    if (json.day2 && !validDays.includes(json.day2)) {
      return NextResponse.json(
        { error: 'Invalid day2. Must be a valid day of the week.' },
        { status: 400 }
      );
    }

    const group = await prisma.group.update({
      where: {
        id: params.id
      },
      data: {
        name: json.name,
        day1: json.day1,
        day2: json.day2,
        startTime: json.startTime,
        endTime: json.endTime,
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete a group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.group.delete({
      where: {
        id: params.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting group:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 