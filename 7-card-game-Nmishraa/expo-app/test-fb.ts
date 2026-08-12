import { ref, get } from 'firebase/database';
import { db } from './src/firebase';

async function test() {
  const snapshot = await get(ref(db, 'rooms'));
  if (!snapshot.exists()) {
    console.log("No rooms");
    process.exit(0);
  }
  const rooms = snapshot.val();
  const roomIds = Object.keys(rooms);
  console.log("Rooms found:", roomIds);
  
  for (const id of roomIds) {
    const r = rooms[id];
    console.log(`Room ${id}: messages =`, r.messages);
  }
  process.exit(0);
}

test();
