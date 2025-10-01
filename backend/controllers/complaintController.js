const Complaint = require('../models/complaintModel');

exports.createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority } = req.body;

    // The user ID comes from the `optionalAuth` middleware.
    // If the user is not logged in, `req.user` will be undefined, so we'll use null.
    const userId = req.user ? req.user.id : null;

    // Basic validation to ensure all required fields from the form are present.
    if (!title || !category || !description || !priority) {
      return res.status(400).json({ message: 'Please provide all required fields (title, category, description, priority).' });
    }
    
    // We now group all complaint data into a single object. This is the key change.
    const complaintData = {
      user_id: userId,
      title,
      category,
      description,
      priority
    };

    // We pass the entire object to the model's create function.
    const newComplaintId = await Complaint.create(complaintData);

    res.status(201).json({ 
      message: 'Complaint submitted successfully', 
      complaintId: newComplaintId 
    });

  } catch (err) {
    // This is where the error you saw is being caught and logged.
    console.error("Error creating complaint:", err.message);
    res.status(500).json({ error: 'Failed to submit complaint due to a server error.' });
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