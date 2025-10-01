// backend/controllers/logController.js

// This controller handles logging events from the frontend.
exports.logNotFound = (req, res) => {
  const { path } = req.body;
  if (path) {
    // Log the event to the server console with a timestamp.
    console.warn(`[404 LOG] Client-side route not found: User tried to access "${path}" at ${new Date().toISOString()}`);
  }
  // Send a 204 No Content response as we don't need to send any data back.
  res.status(204).send();
};