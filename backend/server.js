// Ensure environment variables are loaded right at the start
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
const logRoutes = require('./routes/log'); // 1. IMPORT THE NEW LOG ROUTE

const app = express();

// --- Middlewares ---

// 1. Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 2. Enable Express to parse JSON in request bodies
app.use(express.json());


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/log', logRoutes); // 2. USE THE NEW LOG ROUTE


// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running successfully on port ${PORT}`);
});

