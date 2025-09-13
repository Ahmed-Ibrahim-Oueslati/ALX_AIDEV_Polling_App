// src/app/api/votes/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Vote cast' });
}
