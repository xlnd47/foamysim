export async function getPackages() {
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationCode: "",
        type: "",
        packageCode: "",
        iccid: ""
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
  
    return response.json();
}

export async function orderPackage(packageCode: string, price: number) {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      packageCode,
      price,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to order package');
  }

  return response.json();
}