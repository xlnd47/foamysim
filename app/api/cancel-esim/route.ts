import { NextResponse } from 'next/server';
import { generateApiHeaders } from '../../utils/apiHeaders';

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;
  const headers = generateApiHeaders();
  const { iccid } = await request.json();

  const response = await fetch(`${apiUrl}/api/v1/open/esim/cancel`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ iccid }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}