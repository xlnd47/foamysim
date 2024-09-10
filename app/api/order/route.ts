import { NextResponse } from 'next/server';
import { generateApiHeaders } from '../../utils/apiHeaders';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;
  const headers = generateApiHeaders();
  const { packageCode, price } = await request.json();

  const transactionId = uuidv4();

  const response = await fetch(`${apiUrl}/api/v1/open/esim/order`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      transactionId,
      amount: price,
      packageInfoList: [{
        packageCode,
        count: 1,
        price,
      }],
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}