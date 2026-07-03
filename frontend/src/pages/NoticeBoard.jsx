import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiBell, FiInbox, FiAlertCircle, FiUser } from 'react-icons/fi';
import { BsPinAngleFill } from 'react-icons/bs';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    API.get('/notices').then(res => setNotices(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><FiBell size={20} /> Notice Board</h2>

      {notices.length === 0 && (
        <div style={styles.empty}>
          <FiInbox size={22} />
          <p>No notices posted yet.</p>
        </div>
      )}

      {notices.map(n => (
        <div key={n._id} style={{ ...styles.card, borderLeft: n.isPinned ? '3px solid #111827' : '3px solid #f0f1f3' }}>
          {(n.isPinned || n.isImportant) && (
            <div style={styles.row}>
              {n.isPinned && <span style={styles.pinned}><BsPinAngleFill size={11} /> Pinned</span>}
              {n.isImportant && <span style={styles.important}><FiAlertCircle size={12} /> Important</span>}
            </div>
          )}
          <p style={styles.content}>{n.content}</p>
          <p style={styles.meta}><FiUser size={12} /> {n.admin?.name} · {new Date(n.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding:'2.5rem 1.5rem', maxWidth:'700px', margin:'0 auto', fontFamily:"'Inter', system-ui, sans-serif" },
  title: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  empty: { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', color:'#9ca3af', padding:'3rem 0' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', marginBottom:'1rem' },
  row: { display:'flex', gap:'0.5rem', marginBottom:'0.6rem' },
  pinned: { display:'flex', alignItems:'center', gap:'4px', background:'#f3f4f6', color:'#111827', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  important: { display:'flex', alignItems:'center', gap:'4px', background:'#fffbeb', color:'#d97706', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  content: { color:'#374151', fontSize:'0.92rem', lineHeight:1.5, marginBottom:'0.6rem' },
  meta: { display:'flex', alignItems:'center', gap:'5px', color:'#9ca3af', fontSize:'0.8rem' }
};