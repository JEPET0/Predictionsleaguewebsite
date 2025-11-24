import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Get all players
app.get('/make-server-d80ad9e6/players', async (c) => {
  try {
    const players = await kv.getByPrefix('player:');
    return c.json({ success: true, players: players || [] });
  } catch (error) {
    console.error('Error fetching players:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Register new player
app.post('/make-server-d80ad9e6/auth/register', async (c) => {
  try {
    const { name, password } = await c.req.json();
    
    if (!name || !password) {
      return c.json({ success: false, error: 'Nombre y contraseña son obligatorios' }, 400);
    }
    
    const playerKey = `player:${name}`;
    const existingPlayer = await kv.get(playerKey);
    
    if (existingPlayer) {
      return c.json({ success: false, error: 'Este nombre ya está en uso' }, 400);
    }
    
    console.log(`Creating new player: ${name}`);
    const player = {
      name,
      password, // In a real app, hash this with bcrypt
      score: 0,
      predictions: {}
    };
    
    await kv.set(playerKey, player);
    console.log(`Player ${name} registered successfully`);
    
    // Return player without password
    const { password: _, ...playerWithoutPassword } = player;
    return c.json({ success: true, player: playerWithoutPassword });
  } catch (error) {
    console.error('Error registering player:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Login player
app.post('/make-server-d80ad9e6/auth/login', async (c) => {
  try {
    const { name, password } = await c.req.json();
    
    if (!name || !password) {
      return c.json({ success: false, error: 'Nombre y contraseña son obligatorios' }, 400);
    }
    
    const playerKey = `player:${name}`;
    const player = await kv.get(playerKey);
    
    if (!player) {
      return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
    }
    
    if (player.password !== password) {
      return c.json({ success: false, error: 'Contraseña incorrecta' }, 401);
    }
    
    console.log(`Player ${name} logged in successfully`);
    
    // Return player without password
    const { password: _, ...playerWithoutPassword } = player;
    return c.json({ success: true, player: playerWithoutPassword });
  } catch (error) {
    console.error('Error logging in:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Save prediction
app.post('/make-server-d80ad9e6/predictions/:name/:gala', async (c) => {
  try {
    const name = c.req.param('name');
    const gala = parseInt(c.req.param('gala'));
    const prediction = await c.req.json();
    
    // Check if predictions are locked for this gala
    const lockStatus = await kv.get('predictions:locked') || {};
    if (lockStatus[gala]) {
      return c.json({ 
        success: false, 
        error: 'Las predicciones están cerradas para esta gala' 
      }, 403);
    }
    
    const playerKey = `player:${name}`;
    let player = await kv.get(playerKey);
    
    // If player doesn't exist, create it
    if (!player) {
      console.log(`Player ${name} not found, creating new player`);
      player = {
        name,
        score: 0,
        predictions: {}
      };
    }
    
    player.predictions[gala] = prediction;
    await kv.set(playerKey, player);
    
    console.log(`Prediction saved for player ${name}, gala ${gala}`);
    return c.json({ success: true, player });
  } catch (error) {
    console.error('Error saving prediction:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get gala results
app.get('/make-server-d80ad9e6/results', async (c) => {
  try {
    const results = await kv.get('gala:results') || {};
    return c.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update gala results and calculate points (admin only)
app.post('/make-server-d80ad9e6/results/:gala', async (c) => {
  try {
    const gala = parseInt(c.req.param('gala'));
    const result = await c.req.json();
    
    // Save gala result
    const allResults = await kv.get('gala:results') || {};
    allResults[gala] = result;
    await kv.set('gala:results', allResults);
    
    // Get all players and calculate points
    const players = await kv.getByPrefix('player:');
    
    for (const player of players) {
      const playerPrediction = player.predictions?.[gala];
      if (!playerPrediction) continue;
      
      let points = 0;
      
      // Favorite of the week (100 points)
      if (playerPrediction.winner === result.winner) {
        points += 100;
      }
      
      // Eliminated (75 points)
      if (playerPrediction.eliminated === result.eliminated) {
        points += 75;
      }
      
      // Proposed (25 points each)
      playerPrediction.proposed?.forEach((p: string) => {
        if (result.proposed.includes(p)) {
          points += 25;
        }
      });
      
      // Nominated (50 points each)
      playerPrediction.nominated?.forEach((n: string) => {
        if (result.nominated.includes(n)) {
          points += 50;
        }
      });
      
      // Update player score
      player.score = (player.score || 0) + points;
      await kv.set(`player:${player.name}`, player);
    }
    
    return c.json({ success: true, results: allResults });
  } catch (error) {
    console.error('Error updating results:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get predictions lock status
app.get('/make-server-d80ad9e6/predictions-lock', async (c) => {
  try {
    const lockStatus = await kv.get('predictions:locked') || {};
    return c.json({ success: true, lockStatus });
  } catch (error) {
    console.error('Error fetching predictions lock:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Toggle predictions lock for a gala
app.post('/make-server-d80ad9e6/predictions-lock', async (c) => {
  try {
    const { gala, locked } = await c.req.json();
    
    if (!gala) {
      return c.json({ success: false, error: 'Gala es obligatoria' }, 400);
    }
    
    const lockStatus = await kv.get('predictions:locked') || {};
    lockStatus[gala] = locked;
    await kv.set('predictions:locked', lockStatus);
    
    return c.json({ success: true, lockStatus });
  } catch (error) {
    console.error('Error toggling predictions lock:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Debug endpoint - Get all keys (for development)
app.get('/make-server-d80ad9e6/debug/keys', async (c) => {
  try {
    const players = await kv.getByPrefix('player:');
    const results = await kv.get('gala:results');
    return c.json({ 
      success: true, 
      data: {
        players: players || [],
        results: results || {},
        playerCount: players?.length || 0
      }
    });
  } catch (error) {
    console.error('Error getting debug keys:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reset database (for development - remove in production)
app.post('/make-server-d80ad9e6/debug/reset', async (c) => {
  try {
    const ADMIN_USERS = ['Victorr']; // Usuarios administradores que NO se borrarán
    
    const players = await kv.getByPrefix('player:');
    
    // Delete all players EXCEPT admins
    if (players && players.length > 0) {
      const playersToDelete = players
        .filter(p => !ADMIN_USERS.includes(p.name))
        .map(p => `player:${p.name}`);
      
      if (playersToDelete.length > 0) {
        await kv.mdel(playersToDelete);
      }
      
      // Reset score and predictions for admin users, but keep them in the database
      for (const adminName of ADMIN_USERS) {
        const adminPlayer = await kv.get(`player:${adminName}`);
        if (adminPlayer) {
          adminPlayer.score = 0;
          adminPlayer.predictions = {};
          await kv.set(`player:${adminName}`, adminPlayer);
        }
      }
    }
    
    // Delete results
    await kv.del('gala:results');
    
    console.log('Database reset successfully (admin users preserved)');
    return c.json({ success: true, message: 'Database reset successfully (admin users preserved)' });
  } catch (error) {
    console.error('Error resetting database:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
