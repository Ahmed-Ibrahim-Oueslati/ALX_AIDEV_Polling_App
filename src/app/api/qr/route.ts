// src/app/api/qr/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'QR code generated' });
}
