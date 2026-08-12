import { ref, set, get } from 'firebase/database';
import { db } from './src/firebase';

async function test() {
  const roomId = 'test_chat';
  await set(ref(db, `rooms/${roomId}`), { id: roomId, messages: [] });
  
  // Test sending
  const messages = [];
  messages.push({ id: '1', text: 'hello' });
  await set(ref(db, `rooms/${roomId}/messages`), messages);
  
  const snap = await get(ref(db, `rooms/${roomId}`));
  const room = snap.val();
  console.log("Is array?", Array.isArray(room.messages));
  console.log("Messages:", room.messages);
  
  process.exit(0);
}
test();
