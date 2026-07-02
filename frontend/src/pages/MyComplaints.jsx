import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    API.get('/complaints/my').then(res => setComplaints(res.data));
  }, []);

  const statusColor = { open:'#ef4444', in_progress:'#f59e0b', resolved:'#10b981' };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Complaints</h2>
      {complaints.length === 0 && <p>No complaints raised yet.</p>}
      {complaints.map(c => (
        <div key={c._id} style={styles.card}>
          <div style={styles.row}>
            <span style={styles.category}>{c.category.toUpperCase()}</span>
            <span style={{ ...styles.badge, background: statusColor[c.status] }}>
              {c.status.replace('_', ' ')}
            </span>
            {c.isOverdue && <span style={styles.overdue}>OVERDUE</span>}
          </div>
          <p style={styles.desc}>{c.description}</p>
          {c.photoUrl && <img src={c.photoUrl} alt="complaint" style={styles.photo} />}
          <p style={styles.priority}>Priority: <b>{c.priority}</b></p>

          {c.history.length > 0 && (
            <div style={styles.history}>
              <p style={styles.historyTitle}>Status History</p>
              {c.history.map((h, i) => (
                <div key={i} style={styles.historyItem}>
                  <span>{h.oldStatus} → {h.newStatus}</span>
                  <span style={styles.historyDate}>{new Date(h.changedAt).toLocaleString()}</span>
                  {h.note && <p style={styles.historyNote}>Note: {h.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding:'2rem', maxWidth:'700px', margin:'0 auto' },
  title: { marginBottom:'1.5rem', color:'#333' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'1rem' },
  row: { display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' },
  category: { fontWeight:'bold', color:'#4f46e5' },
  badge: { color:'#fff', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  overdue: { background:'#ef4444', color:'#fff', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  desc: { color:'#555', marginBottom:'0.5rem' },
  photo: { width:'100%', maxHeight:'200px', objectFit:'cover', borderRadius:'8px', marginBottom:'0.5rem' },
  priority: { color:'#777', fontSize:'0.9rem' },
  history: { marginTop:'1rem', borderTop:'1px solid #eee', paddingTop:'0.5rem' },
  historyTitle: { fontWeight:'bold', marginBottom:'0.5rem' },
  historyItem: { background:'#f9f9f9', padding:'0.5rem', borderRadius:'6px', marginBottom:'0.4rem' },
  historyDate: { float:'right', color:'#999', fontSize:'0.8rem' },
  historyNote: { color:'#666', fontSize:'0.85rem', marginTop:'0.2rem' }
};