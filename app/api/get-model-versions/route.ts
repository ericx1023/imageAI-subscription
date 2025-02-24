import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET() {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const versions = await replicate.models.versions.list("ericx1023", "model");
    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching model versions:', error);
    return NextResponse.json({ error: 'Failed to fetch model versions' }, { status: 500 });
  }
} 