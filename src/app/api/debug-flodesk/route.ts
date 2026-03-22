import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.FLODESK_API_KEY || '';
  const segId = process.env.FLODESK_WAITLIST_SEGMENT_ID || '';
  
  const encoded = Buffer.from(`${key}:`).toString('base64');
  
  let result: { status?: number; body?: string; error?: string } = {};
  try {
    const res = await fetch('https://api.flodesk.com/v1/segments', {
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
    });
    const body = await res.text();
    result = { status: res.status, body: body.substring(0, 500) };
  } catch (e: unknown) {
    result = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({
    keyLength: key.length,
    keyStart: key.substring(0, 20),
    keyEnd: key.substring(key.length - 10),
    segmentId: segId,
    flodeskTest: result,
  });
}
