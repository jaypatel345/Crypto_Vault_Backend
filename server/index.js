const express = require('express');
const app = express();
const cors = require('cors');
const { MONGODB_URL, PORT } = require('./config/serverConfig');
const { connectDB } = require('./db/connect');
const authenticationRoute = require('./routes/authenticationRoute');
const uploadImageRoute = require('./routes/uploadImageRoute');
const getImageRoute = require('./routes/getImageRoute');

app.use(cors());
app.use(express.json());

// Optional: Health check endpoint
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', authenticationRoute);
app.use('/api', uploadImageRoute);
app.use('/api', getImageRoute);

async function serverStart() {
  try {
    await connectDB(MONGODB_URL);
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

// Optional: Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Optionally exit process or perform cleanup
});

serverStart();
