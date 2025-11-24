import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d80ad9e6`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
};

export interface Prediction {
  winner: string;
  eliminated: string;
  proposed: string[];
  nominated: string[];
}

export interface Player {
  name: string;
  score: number;
  predictions: { [gala: number]: Prediction };
}

// Get all players
export async function getPlayers(): Promise<Player[]> {
  try {
    const response = await fetch(`${BASE_URL}/players`, { headers });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.players;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
}

// Register new player
export async function registerPlayer(name: string, password: string): Promise<Player> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, password })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.player;
  } catch (error) {
    console.error('Error registering player:', error);
    throw error;
  }
}

// Login player
export async function loginPlayer(name: string, password: string): Promise<Player> {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, password })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.player;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Save prediction
export async function savePrediction(name: string, gala: number, prediction: Prediction): Promise<Player> {
  try {
    const response = await fetch(`${BASE_URL}/predictions/${encodeURIComponent(name)}/${gala}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(prediction)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.player;
  } catch (error) {
    console.error('Error saving prediction:', error);
    throw error;
  }
}

// Get gala results
export async function getGalaResults(): Promise<{ [gala: number]: Prediction }> {
  try {
    const response = await fetch(`${BASE_URL}/results`, { headers });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.results;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

// Update gala results (admin only)
export async function updateGalaResults(gala: number, result: Prediction): Promise<{ [gala: number]: Prediction }> {
  try {
    const response = await fetch(`${BASE_URL}/results/${gala}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(result)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.results;
  } catch (error) {
    console.error('Error updating results:', error);
    throw error;
  }
}

// Debug: Get all data
export async function debugGetAllData() {
  try {
    const response = await fetch(`${BASE_URL}/debug/keys`, { headers });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.data;
  } catch (error) {
    console.error('Error getting debug data:', error);
    throw error;
  }
}

// Debug: Reset database
export async function debugResetDatabase() {
  try {
    const response = await fetch(`${BASE_URL}/debug/reset`, {
      method: 'POST',
      headers
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

// Get predictions lock status
export async function getPredictionsLock(): Promise<{ [gala: number]: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/predictions-lock`, { headers });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.lockStatus;
  } catch (error) {
    console.error('Error fetching predictions lock:', error);
    throw error;
  }
}

// Toggle predictions lock for a gala
export async function togglePredictionsLock(gala: number, locked: boolean): Promise<{ [gala: number]: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/predictions-lock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ gala, locked })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.lockStatus;
  } catch (error) {
    console.error('Error toggling predictions lock:', error);
    throw error;
  }
}
