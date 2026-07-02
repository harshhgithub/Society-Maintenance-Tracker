import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🏢 Society Tracker</span>
      <div style={styles.links}>
        {user.role === 'resident' && (
          <>
            <Link style={styles.link} to="/dashboard">Home</Link>
            <Link style={styles.link} to="/raise-complaint">Raise Complaint</Link>
            <Link style={styles.link} to="/my-complaints">My Complaints</Link>
            <Link style={styles.link} to="/notices">Notices</Link>
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Link style={styles.link} to="/admin">Dashboard</Link>
            <Link style={styles.link} to="/admin/complaints">Complaints</Link>
            <Link style={styles.link} to="/admin/post-notice">Post Notice</Link>
            <Link style={styles.link} to="/notices">Notices</Link>
          </>
        )}
        <span style={styles.user}>{user.name}</span>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 2rem', background:'#4f46e5', color:'#fff' },
  logo: { fontWeight:'bold', fontSize:'1.2rem' },
  links: { display:'flex', alignItems:'center', gap:'1rem' },
  link: { color:'#fff', textDecoration:'none', fontSize:'0.95rem' },
  user: { color:'#c7d2fe', fontSize:'0.9rem' },
  logout: { padding:'6px 14px', background:'#fff', color:'#4f46e5', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' }
};