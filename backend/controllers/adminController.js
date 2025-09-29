const Complaint = require('../models/complaintModel');

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.getAll();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status, admin_comment } = req.body;
  try {
    await Complaint.updateStatus(id, status, admin_comment);
    res.json({ message: 'Complaint updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
