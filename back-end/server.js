import 'dotenv/config'; // Loads environment variables
import app from './app.js';

const PORT = process.env.PORT || 3001;

// Start the Express server
app.listen(PORT, () => {
    console.log(`[Back-End] Server is running on http://localhost:${PORT}`);
});
