const Complaint = require('../models/complaintModel');
const db = require('../config/db');

// Fetches all complaints for the dashboard list.
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.getAll();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve complaints.' });
  }
};

// Fetches the summary statistics for the dashboard cards.
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalResult] = await db.query("SELECT COUNT(*) as count FROM complaints");
    const [pendingResult] = await db.query("SELECT COUNT(*) as count FROM complaints WHERE status = 'new'");
    const [inProgressResult] = await db.query("SELECT COUNT(*) as count FROM complaints WHERE status = 'in-progress'");
    const [resolvedResult] = await db.query("SELECT COUNT(*) as count FROM complaints WHERE status = 'resolved'");

    const stats = [
      { title: "Total Complaints", value: totalResult[0].count.toString(), iconName: "FileText" },
      { title: "Pending Review", value: pendingResult[0].count.toString(), iconName: "Clock" },
      { title: "In Progress", value: inProgressResult[0].count.toString(), iconName: "Users" },
      { title: "Resolved", value: resolvedResult[0].count.toString(), iconName: "CheckCircle" },
    ];
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dashboard stats.' });
  }
};

// Handles updating the status and comment of a specific complaint.
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const affectedRows = await Complaint.updateStatus(id, status, admin_comment);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.json({ message: 'Complaint status updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint status.' });
  }
};