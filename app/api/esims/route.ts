import { NextResponse } from 'next/server';
import { generateApiHeaders } from '../../utils/apiHeaders';

export async function POST() {
  const apiUrl = process.env.API_URL;
  
  const headers = generateApiHeaders();

  const response = await fetch(`${apiUrl}/api/v1/open/esim/query`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      orderNo: "",
      iccid: "",
      pager: {
        pageNum: 1,
        pageSize: 20
      }
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}