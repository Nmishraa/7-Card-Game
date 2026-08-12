const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://2.24.200.44:8087/api/v1';
};

const getHealthUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/health`;
  }
  return 'http://2.24.200.44:8087/health';
};

export const apiService = {
  // Health Check
  getHealthStatus: async () => {
    try {
      const res = await fetch(getHealthUrl());
      return await res.json();
    } catch (err: any) {
      console.warn('[API Service] Health check failed:', err.message);
      return { status: 'offline', error: err.message };
    }
  },

  // Auth
  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${getBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return await res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  },

  // Rooms
  createRoom: async (token: string, maxRounds = 5) => {
    const res = await fetch(`${getBaseUrl()}/rooms`, {
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
    const res = await fetch(`${getBaseUrl()}/rooms`);
    return await res.json();
  },

  getRoom: async (roomId: string) => {
    const res = await fetch(`${getBaseUrl()}/rooms/${roomId}`);
    return await res.json();
  },

  deleteRoom: async (roomId: string, token: string) => {
    const res = await fetch(`${getBaseUrl()}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await res.json();
  },

  // User Profile
  getUserProfile: async (userId: string) => {
    const res = await fetch(`${getBaseUrl()}/users/${userId}`);
    return await res.json();
  },
};
