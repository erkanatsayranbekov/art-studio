import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/groups - Get all groups
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'day1', 'day2', 'startTime', 'endTime'];
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(json.startTime) || !timeRegex.test(json.endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:mm format.' },
        { status: 400 }
      );
    }

    // Validate days of the week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(json.day1) || !validDays.includes(json.day2)) {
      return NextResponse.json(
        { error: 'Invalid day. Must be a valid day of the week.' },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name: json.name,
        day1: json.day1,
        day2: json.day2,
        startTime: json.startTime,
        endTime: json.endTime,
      }
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 