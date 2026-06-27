const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function createBooking(booking) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to submit booking');
  }

  return response.json();
}
