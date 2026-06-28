import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (form) => {
    try {
      if (editTask) {
        const res = await api.put(`/tasks/${editTask._id}`, form);
        setTasks(tasks.map(t => t._id === editTask._id ? res.data : t));
      } else {
        const res = await api.post('/tasks', form);
        setTasks([res.data, ...tasks]);
      }
      setShowModal(false);
      setEditTask(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) { console.error(err); }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const filtered = tasks
    .filter(t => filter === 'all' ? true : t.status === filter)
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Task Tracker</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>Hi, {user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <button onClick={() => { setEditTask(null); setShowModal(true); }} style={styles.addBtn}>
          + Add Task
        </button>
        <div style={styles.controls}>
          <select style={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select style={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>Total: {tasks.length}</div>
        <div style={styles.stat}>Todo: {tasks.filter(t => t.status === 'todo').length}</div>
        <div style={styles.stat}>In Progress: {tasks.filter(t => t.status === 'in-progress').length}</div>
        <div style={styles.stat}>Done: {tasks.filter(t => t.status === 'done').length}</div>
      </div>

      <div style={styles.tasks}>
        {filtered.length === 0
          ? <p style={styles.empty}>No tasks found. Add one!</p>
          : filtered.map(task => (
            <TaskCard key={task._id} task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))
        }
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #4f46e5' },
  title: { margin: 0, color: '#4f46e5' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcome: { color: '#666', fontSize: '0.9rem' },
  logoutBtn: { padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', cursor: 'pointer' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  addBtn: { padding: '0.6rem 1.25rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  controls: { display: 'flex', gap: '0.5rem' },
  select: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' },
  stats: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  stat: { background: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '0.9rem', color: '#555' },
  tasks: { },
  empty: { textAlign: 'center', color: '#888', marginTop: '3rem' }
};