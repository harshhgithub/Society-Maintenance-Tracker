import { useEffect, useState } from 'react';
import API from '../api/axios';

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

  const statusColor = { open:'#ef4444', in_progress:'#f59e0b', resolved:'#10b981' };

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
        <button style={styles.filterBtn} onClick={fetchComplaints}>Filter</button>
      </div>

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
          <p style={styles.meta}>By: {c.user?.name} ({c.user?.email})</p>
          {c.photoUrl && <img src={c.photoUrl} alt="complaint" style={styles.photo} />}

          {/* Priority */}
          <div style={styles.actionRow}>
            <label>Priority: </label>
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
                style={{ ...styles.btn, background:'#f59e0b' }}
                onClick={() => {
                  const note = prompt('Add a note (optional):');
                  updateStatus(c._id, 'in_progress', note);
                }}
              >Mark In Progress</button>
              <button
                style={{ ...styles.btn, background:'#10b981' }}
                onClick={() => {
                  const note = prompt('Add a note (optional):');
                  updateStatus(c._id, 'resolved', note);
                }}
              >Mark Resolved</button>
            </div>
          )}

          {/* History */}
          {c.history.length > 0 && (
            <div style={styles.history}>
              <p style={styles.historyTitle}>History</p>
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
  container: { padding:'2rem', maxWidth:'800px', margin:'0 auto' },
  title: { marginBottom:'1rem', color:'#333' },
  filters: { display:'flex', gap:'0.5rem', marginBottom:'1.5rem' },
  select: { padding:'8px', borderRadius:'6px', border:'1px solid #ddd' },
  filterBtn: { padding:'8px 16px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'1rem' },
  row: { display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' },
  category: { fontWeight:'bold', color:'#4f46e5' },
  badge: { color:'#fff', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  overdue: { background:'#ef4444', color:'#fff', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem' },
  desc: { color:'#555', marginBottom:'0.3rem' },
  meta: { color:'#999', fontSize:'0.85rem', marginBottom:'0.5rem' },
  photo: { width:'100%', maxHeight:'200px', objectFit:'cover', borderRadius:'8px', marginBottom:'0.5rem' },
  actionRow: { display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem' },
  btn: { padding:'6px 14px', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  history: { marginTop:'1rem', borderTop:'1px solid #eee', paddingTop:'0.5rem' },
  historyTitle: { fontWeight:'bold', marginBottom:'0.5rem' },
  historyItem: { background:'#f9f9f9', padding:'0.5rem', borderRadius:'6px', marginBottom:'0.4rem' },
  historyDate: { float:'right', color:'#999', fontSize:'0.8rem' },
  historyNote: { color:'#666', fontSize:'0.85rem', marginTop:'0.2rem' }
};