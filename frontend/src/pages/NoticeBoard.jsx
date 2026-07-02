import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    API.get('/notices').then(res => setNotices(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📢 Notice Board</h2>
      {notices.length === 0 && <p>No notices posted yet.</p>}
      {notices.map(n => (
        <div key={n._id} style={{ ...styles.card, borderLeft: n.isPinned ? '4px solid #4f46e5' : '4px solid #ddd' }}>
          <div style={styles.row}>
            {n.isPinned && <span style={styles.pinned}>📌 Pinned</span>}
            {n.isImportant && <span style={styles.important}>⚠️ Important</span>}
          </div>
          <p style={styles.content}>{n.content}</p>
          <p style={styles.meta}>Posted by {n.admin?.name} · {new Date(n.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding:'2rem', maxWidth:'700px', margin:'0 auto' },
  title: { marginBottom:'1.5rem', color:'#333' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'1rem' },
  row: { display:'flex', gap:'0.5rem', marginBottom:'0.5rem' },
  pinned: { background:'#ede9fe', color:'#4f46e5', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  important: { background:'#fef3c7', color:'#d97706', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  content: { color:'#333', marginBottom:'0.5rem' },
  meta: { color:'#999', fontSize:'0.85rem' }
};