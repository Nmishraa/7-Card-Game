const API_BASE_URL = 'http://localhost:5000/api/v1';

export const apiService = {
  // Health Check
  getHealthStatus: async () => {
    try {
      const res = await fetch('http://localhost:5000/health');
      return await res.json();
    } catch (err: any) {
      console.warn('[API Service] Health check failed:', err.message);
      return { status: 'offline', error: err.message };
    }
  },

  // Auth
  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return await res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  },

  // Rooms
  createRoom: async (token: string, maxRounds = 5) => {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ maxRounds }),
    });
    return await res.json();
  },

  listRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    return await res.json();
  },

  getRoom: async (roomId: string) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
    return await res.json();
  },

  deleteRoom: async (roomId: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await res.json();
  },

  // User Profile
  getUserProfile: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`);
    return await res.json();
  },
};
