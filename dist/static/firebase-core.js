import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
const config = { apiKey: 'AIzaSyC1lLFDnMtbwAqgp5VTpKLM63d2A9AYs5o', authDomain: 'amigo-learning.firebaseapp.com', projectId: 'amigo-learning', appId: '1:842416550913:web:8b63ca8452be5e12883c00' };
export const app = getApps().length ? getApp() : initializeApp(config);
export const db = getFirestore(app);
let pending;
export function getCatalog() {
  if (!pending) pending = Promise.all(['faculties','courses','instructors'].map(async name => {
    const q = query(collection(db, name), where('status','in',['demo','published']));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(item => ({...item.data(), id: item.id}));
  })).then(([faculties,courses,instructors]) => ({faculties,courses,instructors})).catch(err => { pending = null; throw err; });
  return pending;
}
