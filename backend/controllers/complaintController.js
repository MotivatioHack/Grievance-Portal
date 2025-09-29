const Complaint = require('../models/complaintModel');

exports.addComplaint = async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const userIdFromToken = req.user.id;
    const id = await Complaint.create(userIdFromToken, title, description, priority);
    res.json({ message: 'Complaint added', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  const requestedUserId = req.params.userId;
  try {
    if (String(req.user.id) !== String(requestedUserId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const complaints = await Complaint.getByUserId(requestedUserId);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
