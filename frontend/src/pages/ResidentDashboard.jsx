import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiList, FiVolume2 } from 'react-icons/fi';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    { icon: FiPlusCircle, title: 'Raise Complaint', text: 'Submit a new maintenance complaint', path: '/raise-complaint' },
    { icon: FiList, title: 'My Complaints', text: 'Track your complaint status', path: '/my-complaints' },
    { icon: FiVolume2, title: 'Notice Board', text: 'View society notices', path: '/notices' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome, {user?.name}</h2>
      <div style={styles.grid}>
        {cards.map(({ icon: CardIcon, title, text, path }) => (
          <div key={path} style={styles.card} onClick={() => navigate(path)}>
            <div style={styles.iconWrap}><CardIcon size={20} /></div>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardText}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding:'2rem', maxWidth:'800px', margin:'0 auto', fontFamily:"'Inter', system-ui, sans-serif" },
  title: { marginBottom:'2rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'12px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s' },
  iconWrap: { width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6', color:'#111827', borderRadius:'10px', marginBottom:'0.9rem' },
  cardTitle: { margin:0, color:'#111827', fontSize:'1rem', fontWeight:600 },
  cardText: { margin:'0.4rem 0 0', color:'#6b7280', fontSize:'0.88rem' }
};