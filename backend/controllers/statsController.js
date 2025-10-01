const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    // Query the database to get the count of resolved complaints
    const [resolvedResult] = await db.query("SELECT COUNT(*) as count FROM complaints WHERE status = 'resolved'");
    const resolvedCount = resolvedResult[0].count;

    // Construct the stats array with dynamic and static data
    const stats = [
      { number: `${resolvedCount.toLocaleString()}+`, label: "Complaints Resolved", iconName: "TrendingUp" },
      { number: "24/7", label: "Portal Availability", iconName: "Clock" },
      { number: "99.9%", label: "System Uptime", iconName: "Zap" },
      { number: "100%", label: "Transparency", iconName: "Eye" },
    ];

    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    res.status(500).json({ error: "Failed to retrieve application statistics." });
  }
};