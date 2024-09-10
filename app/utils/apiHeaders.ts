import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export function generateApiHeaders() {
  const accessCode = process.env.RT_ACCESS_CODE;
  const secretKey = process.env.RT_SECRET_KEY;
  const timestamp = Date.now().toString();
  const requestId = uuidv4();

  const signatureString = `${accessCode}${requestId}${timestamp}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('hex');

  return {
    'RT-AccessCode': accessCode,
    'RT-RequestID': requestId,
    'RT-Signature': signature,
    'RT-Timestamp': timestamp,
    'Content-Type': 'application/json',
  };
}