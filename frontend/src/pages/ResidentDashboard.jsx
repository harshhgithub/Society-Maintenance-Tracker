import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome, {user?.name} 👋</h2>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/raise-complaint')}>
          <h3>📝 Raise Complaint</h3>
          <p>Submit a new maintenance complaint</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/my-complaints')}>
          <h3>📋 My Complaints</h3>
          <p>Track your complaint status</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/notices')}>
          <h3>📢 Notice Board</h3>
          <p>View society notices</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding:'2rem', maxWidth:'800px', margin:'0 auto' },
  title: { marginBottom:'2rem', color:'#333' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', cursor:'pointer', transition:'transform 0.2s' }
};