import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/dashboard').then(res => setStats(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/admin/complaints')}>
          <h3>📋 Manage Complaints</h3>
          <p>View, filter, update complaints</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/admin/post-notice')}>
          <h3>📢 Post Notice</h3>
          <p>Post to the notice board</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/notices')}>
          <h3>📌 View Notices</h3>
          <p>See all posted notices</p>
        </div>
      </div>

      {stats && (
        <div style={styles.statsSection}>
          <h3 style={styles.subtitle}>📊 Stats</h3>
          <div style={styles.grid}>
            {stats.totalByStatus.map(s => (
              <div key={s._id} style={styles.statCard}>
                <p style={styles.statLabel}>{s._id.replace('_', ' ').toUpperCase()}</p>
                <p style={styles.statNum}>{s.count}</p>
              </div>
            ))}
            <div style={{ ...styles.statCard, borderColor:'#ef4444' }}>
              <p style={styles.statLabel}>OVERDUE</p>
              <p style={{ ...styles.statNum, color:'#ef4444' }}>{stats.overdueCount}</p>
            </div>
          </div>

          <h3 style={styles.subtitle}>📂 By Category</h3>
          <div style={styles.grid}>
            {stats.totalByCategory.map(c => (
              <div key={c._id} style={styles.statCard}>
                <p style={styles.statLabel}>{c._id.toUpperCase()}</p>
                <p style={styles.statNum}>{c.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding:'2rem', maxWidth:'900px', margin:'0 auto' },
  title: { marginBottom:'1.5rem', color:'#333' },
  subtitle: { margin:'1.5rem 0 1rem', color:'#444' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', cursor:'pointer' },
  statsSection: { marginTop:'2rem' },
  statCard: { background:'#fff', padding:'1.2rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', border:'2px solid #4f46e5', textAlign:'center' },
  statLabel: { color:'#666', fontSize:'0.85rem', marginBottom:'0.5rem' },
  statNum: { fontSize:'2rem', fontWeight:'bold', color:'#4f46e5' }
};