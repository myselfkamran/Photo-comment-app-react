import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { photoId, content } = await req.json();

  if (!photoId || !content) {
    return NextResponse.json({ success: false, error: 'Missing photoId or content' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      photoId,
      content,
    },
  });

  return NextResponse.json({ success: true, comment });
}

