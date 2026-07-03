import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiClipboard, FiSend, FiBookmark, FiBarChart2, FiAlertTriangle, FiFolder } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/dashboard').then(res => setStats(res.data));
  }, []);

  const cards = [
    { icon: FiClipboard, title: 'Manage Complaints', text: 'View, filter, update complaints', path: '/admin/complaints' },
    { icon: FiSend, title: 'Post Notice', text: 'Post to the notice board', path: '/admin/post-notice' },
    { icon: FiBookmark, title: 'View Notices', text: 'See all posted notices', path: '/notices' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      <div style={styles.grid}>
        {cards.map(({ icon: CardIcon, title, text, path }) => (
          <div key={path} style={styles.card} onClick={() => navigate(path)}>
            <div style={styles.iconWrap}><CardIcon size={20} /></div>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardText}>{text}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div style={styles.statsSection}>
          <h3 style={styles.subtitle}><FiBarChart2 size={16} /> Stats</h3>
          <div style={styles.grid}>
            {stats.totalByStatus.map(s => (
              <div key={s._id} style={styles.statCard}>
                <p style={styles.statLabel}>{s._id.replace('_', ' ')}</p>
                <p style={styles.statNum}>{s.count}</p>
              </div>
            ))}
            <div style={{ ...styles.statCard, ...styles.statCardAlert }}>
              <p style={{ ...styles.statLabel, color:'#dc2626' }}><FiAlertTriangle size={12} /> Overdue</p>
              <p style={{ ...styles.statNum, color:'#dc2626' }}>{stats.overdueCount}</p>
            </div>
          </div>

          <h3 style={styles.subtitle}><FiFolder size={16} /> By Category</h3>
          <div style={styles.grid}>
            {stats.totalByCategory.map(c => (
              <div key={c._id} style={styles.statCard}>
                <p style={styles.statLabel}>{c._id}</p>
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
  container: { padding:'2.5rem 1.5rem', maxWidth:'900px', margin:'0 auto', fontFamily:"'Inter', system-ui, sans-serif" },
  title: { marginBottom:'1.5rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  subtitle: { display:'flex', alignItems:'center', gap:'6px', margin:'2rem 0 1rem', color:'#111827', fontSize:'1rem', fontWeight:600 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'12px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', cursor:'pointer' },
  iconWrap: { width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6', color:'#111827', borderRadius:'10px', marginBottom:'0.9rem' },
  cardTitle: { margin:0, color:'#111827', fontSize:'1rem', fontWeight:600 },
  cardText: { margin:'0.4rem 0 0', color:'#6b7280', fontSize:'0.88rem' },
  statsSection: { marginTop:'1rem' },
  statCard: { background:'#fff', padding:'1.2rem', borderRadius:'12px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', textAlign:'center' },
  statCardAlert: { border:'1px solid #fecaca', background:'#fef2f2' },
  statLabel: { display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color:'#6b7280', fontSize:'0.8rem', marginBottom:'0.5rem', textTransform:'capitalize' },
  statNum: { fontSize:'1.9rem', fontWeight:700, color:'#111827' }
};