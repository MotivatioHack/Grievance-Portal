const Complaint = require('../models/complaintModel');

exports.createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!title || !category || !description || !priority) {
      return res.status(400).json({ message: 'Please provide all required fields (title, category, description, priority).' });
    }
    
    const complaintData = {
      user_id: userId,
      title,
      category,
      description,
      priority,
    };

    const newComplaintId = await Complaint.create(complaintData);

    res.status(201).json({ 
      message: 'Complaint submitted successfully', 
      complaintId: newComplaintId 
    });

  } catch (err) {
    console.error("Error creating complaint:", err.message);
    res.status(500).json({ error: 'Failed to submit complaint due to a server error.' });
  }
};

// --- ADDED FUNCTION ---
// Handles the API request to get a single complaint by its ID
exports.getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.getById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found. Please check the ID and try again.' });
    }

    res.status(200).json(complaint);
  } catch (err) {
    console.error("Error fetching complaint by ID:", err.message);
    res.status(500).json({ error: 'Failed to fetch complaint due to a server error.' });
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
