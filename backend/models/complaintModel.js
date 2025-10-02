const db = require('../config/db');

const generateComplaintId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GRP-${timestamp}-${randomPart}`;
};

const Complaint = {
  create: async (complaintData) => {
    const { user_id, title, category, description, priority } = complaintData;
    const complaint_id = generateComplaintId();
    const [result] = await db.query(
      'INSERT INTO complaints (user_id, complaint_id, title, category, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, complaint_id, title, category, description, priority, 'pending']
    );
    return complaint_id;
  },

  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        c.complaint_id, 
        c.title, 
        c.category, 
        c.priority, 
        c.status, 
        c.created_at, 
        COALESCE(u.name, 'Anonymous') as submittedBy 
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  },

  getByUserId: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM complaints WHERE user_id = ?', [user_id]);
    return rows;
  },

  // --- ADDED FUNCTION ---
  // Gets a single complaint by its public-facing complaint_id
  getById: async (complaint_id) => {
    const [rows] = await db.query('SELECT * FROM complaints WHERE complaint_id = ?', [complaint_id]);
    return rows[0]; // Return the first result (the complaint object) or undefined if not found.
  },

  updateStatus: async (id, status, admin_comment = null) => {
    const [result] = await db.query(
      'UPDATE complaints SET status = ?, admin_comment = ? WHERE id = ?',
      [status, admin_comment, id]
    );
    return result.affectedRows;
  }
};

module.exports = Complaint;
