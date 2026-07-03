import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiAlertTriangle, FiUser, FiFilter, FiCheck, FiClock, FiFileText } from 'react-icons/fi';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '' });

  const fetchComplaints = () => {
    const params = new URLSearchParams(filters).toString();
    API.get(`/complaints/all?${params}`).then(res => setComplaints(res.data));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status, note) => {
    await API.put(`/complaints/${id}/status`, { status, note });
    fetchComplaints();
  };

  const setPriority = async (id, priority) => {
    await API.put(`/complaints/${id}/priority`, { priority });
    fetchComplaints();
  };

  const statusStyle = {
    open: { bg: '#fef2f2', color: '#dc2626' },
    in_progress: { bg: '#fffbeb', color: '#d97706' },
    resolved: { bg: '#f0fdf4', color: '#16a34a' },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Complaints</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <select style={styles.select} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="cleaning">Cleaning</option>
          <option value="security">Security</option>
          <option value="other">Other</option>
        </select>
        <select style={styles.select} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button style={styles.filterBtn} onClick={fetchComplaints}>
          <FiFilter size={14} /> Filter
        </button>
      </div>

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
          <p style={styles.meta}><FiUser size={13} /> {c.user?.name} · {c.user?.email}</p>

          {c.photoUrl && <img src={c.photoUrl} alt="complaint" style={styles.photo} />}

          {/* Priority */}
          <div style={styles.actionRow}>
            <label style={styles.label}>Priority</label>
            <select
              style={styles.select}
              value={c.priority}
              onChange={e => setPriority(c._id, e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status Update */}
          {c.status !== 'resolved' && (
            <div style={styles.actionRow}>
              <button
                style={{ ...styles.btn, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}
                onClick={() => {
                  const note = prompt('Add a note (optional):');
                  updateStatus(c._id, 'in_progress', note);
                }}
              >
                <FiClock size={14} /> Mark In Progress
              </button>
              <button
                style={{ ...styles.btn, background: '#111827', color: '#fff' }}
                onClick={() => {
                  const note = prompt('Add a note (optional):');
                  updateStatus(c._id, 'resolved', note);
                }}
              >
                <FiCheck size={14} /> Mark Resolved
              </button>
            </div>
          )}

          {/* History */}
          {c.history.length > 0 && (
            <div style={styles.history}>
              <p style={styles.historyTitle}><FiClock size={13} /> History</p>
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
  container: { padding:'2.5rem 1.5rem', maxWidth:'760px', margin:'0 auto', fontFamily:"'Inter', system-ui, sans-serif" },
  title: { marginBottom:'1.5rem', color:'#111827', fontSize:'1.4rem', fontWeight:600, letterSpacing:'-0.01em' },
  filters: { display:'flex', gap:'0.6rem', marginBottom:'1.75rem' },
  select: { padding:'8px 12px', borderRadius:'8px', border:'1px solid #e5e7eb', fontSize:'0.85rem', color:'#374151', background:'#fff', outline:'none' },
  filterBtn: { display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'14px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', marginBottom:'1rem' },
  row: { display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.6rem', flexWrap:'wrap' },
  category: { fontWeight:600, color:'#111827', fontSize:'0.8rem', letterSpacing:'0.03em' },
  badge: { padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600, textTransform:'capitalize' },
  overdue: { display:'flex', alignItems:'center', gap:'4px', background:'#fef2f2', color:'#dc2626', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  desc: { color:'#374151', fontSize:'0.92rem', lineHeight:1.5, marginBottom:'0.5rem' },
  meta: { display:'flex', alignItems:'center', gap:'5px', color:'#9ca3af', fontSize:'0.8rem', marginBottom:'0.75rem' },
  photo: { width:'100%', maxHeight:'220px', objectFit:'cover', borderRadius:'10px', marginBottom:'0.75rem' },
  actionRow: { display:'flex', alignItems:'center', gap:'0.6rem', marginTop:'0.6rem' },
  label: { fontSize:'0.82rem', color:'#6b7280' },
  btn: { display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:500, fontSize:'0.82rem' },
  history: { marginTop:'1.1rem', borderTop:'1px solid #f0f1f3', paddingTop:'0.75rem' },
  historyTitle: { display:'flex', alignItems:'center', gap:'5px', fontWeight:600, fontSize:'0.8rem', color:'#6b7280', marginBottom:'0.6rem' },
  historyItem: { background:'#fafafa', padding:'0.6rem 0.75rem', borderRadius:'8px', marginBottom:'0.4rem' },
  historyTop: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  historyChange: { fontSize:'0.82rem', color:'#374151', fontWeight:500, textTransform:'capitalize' },
  historyDate: { color:'#9ca3af', fontSize:'0.75rem' },
  historyNote: { display:'flex', alignItems:'center', gap:'5px', color:'#6b7280', fontSize:'0.8rem', marginTop:'0.3rem' },
};