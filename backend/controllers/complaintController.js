const Complaint = require('../models/complaintModel');

exports.addComplaint = async (req, res) => {
  const { user_id, title, description, priority } = req.body;
  try {
    const id = await Complaint.create(user_id, title, description, priority);
    res.json({ message: 'Complaint added', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  const user_id = req.params.userId;
  try {
    const complaints = await Complaint.getByUserId(user_id);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
