import { useState, useEffect } from "react";

export default function TaskModal({ onClose, onSave, task }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (task)
      setForm({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    onSave(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{task ? "Edit Task" : "New Task"}</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            style={styles.input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            style={styles.input}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            style={styles.input}
            type="date"
            value={form.dueDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <div style={styles.buttons}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  title: { marginBottom: "1rem", color: "#333" },
  error: { color: "red", marginBottom: "1rem" },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "1rem",
    minHeight: "80px",
    resize: "vertical",
  },
  buttons: { display: "flex", gap: "1rem", justifyContent: "flex-end" },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#f3f4f6",
    color: "#333",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
};
