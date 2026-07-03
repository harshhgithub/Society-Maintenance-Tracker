import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

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
      <div style={styles.brand}>
        <div style={styles.brandIcon}><FiHome size={18} /></div>
        <span style={styles.logo}>Society Maintenance Tracker</span>
      </div>
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
        <div style={styles.divider} />
        <span style={styles.user}>{user.name}</span>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 2rem',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111827',
    color: '#fff',
    borderRadius: '8px',
  },
  logo: {
    fontWeight: 600,
    fontSize: '1.05rem',
    color: '#111827',
    letterSpacing: '-0.01em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.15s ease',
  },
  divider: {
    width: '1px',
    height: '20px',
    background: '#e5e7eb',
  },
  user: {
    color: '#6b7280',
    fontSize: '0.85rem',
  },
  logout: {
    padding: '6px 14px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.85rem',
    transition: 'background 0.15s ease',
  },
};