const priorityColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
const statusColors = { todo: '#6b7280', 'in-progress': '#3b82f6', done: '#22c55e' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.title}>{task.title}</h4>
        <span style={{...styles.priority, background: priorityColors[task.priority]}}>
          {task.priority}
        </span>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      <div style={styles.footer}>
        <select style={{...styles.status, color: statusColors[task.status]}}
          value={task.status} onChange={e => onStatusChange(task._id, e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {task.dueDate && <span style={styles.date}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
        <div style={styles.actions}>
          <button onClick={() => onEdit(task)} style={styles.editBtn}>Edit</button>
          <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  title: { margin: 0, color: '#333', fontSize: '1rem' },
  priority: { padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#fff', fontSize: '0.75rem' },
  desc: { color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' },
  footer: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  status: { padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer' },
  date: { fontSize: '0.8rem', color: '#888' },
  actions: { marginLeft: 'auto', display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.3rem 0.75rem', borderRadius: '4px', border: '1px solid #4f46e5', color: '#4f46e5', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  deleteBtn: { padding: '0.3rem 0.75rem', borderRadius: '4px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }
};