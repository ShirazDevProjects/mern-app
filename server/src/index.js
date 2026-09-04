const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const port = process.env.PORT || 4500;

// Store MongoDB database connection error
let dbError = null;

// Store PostgreSQL connection state and error
let pgPool = null;
let isPgConnected = false;
let pgError = null;

// Connect to MongoDB
if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== '') {
    mongoose.connect(process.env.MONGODB_URI, {
        family: 4, // Forces IPv4 connection
  serverSelectionTimeoutMS: 5000
    })
        .then(() => {
            console.log('Connected to MongoDB');
            dbError = null;
        })
        .catch((err) => {
            console.error('MongoDB initial connection error:', err);
            dbError = err.message || String(err);
        });

    mongoose.connection.on('error', err => {
        console.error('MongoDB runtime error:', err);
        dbError = err.message || String(err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        if (!dbError) dbError = 'MongoDB disconnected unexpectedly.';
    });

    mongoose.connection.on('connected', () => {
        dbError = null;
    });
} else {
    dbError = 'MONGODB_URI is not provided in environment variables.';
}

// Connect to PostgreSQL
if (process.env.POSTGRES_URI && process.env.POSTGRES_URI.trim() !== '') {
    pgPool = new Pool({
        connectionString: process.env.POSTGRES_URI,
    });

    pgPool.on('error', (err) => {
        console.error('PostgreSQL runtime pool error:', err);
        isPgConnected = false;
        pgError = err.message || String(err);
    });

    pgPool.query('SELECT NOW()')
        .then(() => {
            console.log('Connected to PostgreSQL');
            isPgConnected = true;
            pgError = null;
        })
        .catch((err) => {
            console.error('PostgreSQL initial connection error:', err);
            isPgConnected = false;
            pgError = err.message || String(err);
        });
} else {
    pgError = 'POSTGRES_URI is not provided in environment variables.';
}


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MERN Server is running!');
});

app.get('/api/message', async (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    let localError = dbError;

    try {
        if (isDbConnected) {
            const Dummy = mongoose.models.Dummy || mongoose.model('Dummy', new mongoose.Schema({ content: String }));
            await Dummy.create({ content: 'Sample dummy data' });
        }
    } catch (err) {
        console.error('Error inserting dummy data:', err);
        localError = err.message || String(err);
    }

    let localPgConnected = isPgConnected;
    let localPgError = pgError;

    if (pgPool) {
        try {
            await pgPool.query('SELECT 1');
            localPgConnected = true;
            localPgError = null;
        } catch (err) {
            console.error('Error querying PostgreSQL:', err);
            localPgConnected = false;
            localPgError = err.message || String(err);
        }
    }

    res.json({
        message: 'Hello from the backend!',
        databaseConnected: isDbConnected,
        error: localError,
        mongoConnected: isDbConnected,
        mongoError: localError,
        postgresConnected: localPgConnected,
        postgresError: localPgError
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

