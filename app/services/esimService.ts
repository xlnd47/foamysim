export async function getEsims() {
    const response = await fetch('/api/esims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch eSIMs');
    }
  
    return response.json();
  }

export async function cancelEsim(iccid: string) {
  const response = await fetch('/api/cancel-esim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ iccid }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel eSIM');
  }

  return response.json();
}