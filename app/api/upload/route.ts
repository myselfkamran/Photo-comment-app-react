import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure the uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  // Save the file to the public/uploads directory
  const path = join(uploadsDir, file.name);
  await writeFile(path, buffer);

  const photo = await prisma.photo.create({
    data: {
      url: `/uploads/${file.name}`,
    },
  });

  return NextResponse.json({ success: true, photo });
}

