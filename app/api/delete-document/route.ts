import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Delete not supported in deployed environment' },
    { status: 501 }
  );
}