const db = require('../config/db');

const Complaint = {
  create: async (user_id, title, description, priority) => {
    const [result] = await db.query(
      'INSERT INTO complaints (user_id, title, description, priority) VALUES (?, ?, ?, ?)',
      [user_id, title, description, priority]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM complaints');
    return rows;
  },

  getByUserId: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM complaints WHERE user_id = ?', [user_id]);
    return rows;
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
