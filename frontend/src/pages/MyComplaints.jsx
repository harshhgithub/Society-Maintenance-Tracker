import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiAlertTriangle, FiClock, FiFileText, FiInbox } from 'react-icons/fi';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    API.get('/complaints/my').then(res => setComplaints(res.data));
  }, []);

  const statusStyle = {
    open: { bg: '#fef2f2', color: '#dc2626' },
    in_progress: { bg: '#fffbeb', color: '#d97706' },
    resolved: { bg: '#f0fdf4', color: '#16a34a' },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Complaints</h2>

      {complaints.length === 0 && (
        <div style={styles.empty}>
          <FiInbox size={22} />
          <p>No complaints raised yet.</p>
        </div>
      )}

      {complaints.map(c => (
        <div key={c._id} style={styles.card}>
          <div style={styles.row}>
            <span style={styles.category}>{c.category.toUpperCase()}</span>
            <span style={{ ...styles.badge, background: statusStyle[c.status].bg, color: statusStyle[c.status].color }}>
              {c.status.replace('_', ' ')}
            </span>
            {c.isOverdue && (
              <span style={styles.overdue}><FiAlertTriangle size={12} /> Overdue</span>
            )}
          </div>

          <p style={styles.desc}>{c.description}</p>
          {c.photoUrl && <img src={c.photoUrl} alt="complaint" style={styles.photo} />}
          <p style={styles.priority}>Priority: <b style={{ textTransform: 'capitalize' }}>{c.priority}</b></p>

          {c.history.length > 0 && (
            <div style={styles.history}>
              <p style={styles.historyTitle}><FiClock size={13} /> Status History</p>
              {c.history.map((h, i) => (
                <div key={i} style={styles.historyItem}>
                  <div style={styles.historyTop}>
                    <span style={styles.historyChange}>{h.oldStatus} → {h.newStatus}</span>
                    <span style={styles.historyDate}>{new Date(h.changedAt).toLocaleString()}</span>
                  </div>
                  {h.note && (
                    <p style={styles.historyNote}><FiFileText size={11} /> {h.note}</p>
                  )}
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
  container: { padding:'2.5rem 1.5rem', maxWidth:'700px', margin:'0 auto', fontFamily:"'Inter', system-ui, sans-serif" },
  title: { marginBottom:'1.5rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  empty: { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', color:'#9ca3af', padding:'3rem 0' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'14px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', marginBottom:'1rem' },
  row: { display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.6rem', flexWrap:'wrap' },
  category: { fontWeight:600, color:'#111827', fontSize:'0.8rem', letterSpacing:'0.03em' },
  badge: { padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600, textTransform:'capitalize' },
  overdue: { display:'flex', alignItems:'center', gap:'4px', background:'#fef2f2', color:'#dc2626', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  desc: { color:'#374151', fontSize:'0.92rem', lineHeight:1.5, marginBottom:'0.5rem' },
  photo: { width:'100%', maxHeight:'200px', objectFit:'cover', borderRadius:'10px', marginBottom:'0.6rem' },
  priority: { color:'#6b7280', fontSize:'0.85rem' },
  history: { marginTop:'1.1rem', borderTop:'1px solid #f0f1f3', paddingTop:'0.75rem' },
  historyTitle: { display:'flex', alignItems:'center', gap:'5px', fontWeight:600, fontSize:'0.8rem', color:'#6b7280', marginBottom:'0.6rem' },
  historyItem: { background:'#fafafa', padding:'0.6rem 0.75rem', borderRadius:'8px', marginBottom:'0.4rem' },
  historyTop: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  historyChange: { fontSize:'0.82rem', color:'#374151', fontWeight:500, textTransform:'capitalize' },
  historyDate: { color:'#9ca3af', fontSize:'0.75rem' },
  historyNote: { display:'flex', alignItems:'center', gap:'5px', color:'#6b7280', fontSize:'0.8rem', marginTop:'0.3rem' },
};