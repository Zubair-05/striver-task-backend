"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.js
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
client.on('error', err => console.log('Redis Client Error', err));
async function connectToRedis() {
    const connection = await client.connect();
    console.log(connection);
}
connectToRedis();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/submissions', async (req, res) => {
    try {
        const values = await client.get('data');
        // values && console.log("data from redis", JSON.parse(values));
        if (values != null)
            res.json(JSON.parse(values));
        else {
            const submissions = await prisma.submissions.findMany();
            await client.set("data", JSON.stringify(submissions));
            res.json(submissions);
        }
    }
    catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'An error occurred while fetching submissions' });
    }
});
app.post('/submissions', async (req, res) => {
    try {
        const { username, language, source_code, stdin } = req.body;
        console.log(username);
        const stdout = "Hello World";
        const submission = await prisma.submissions.create({
            data: {
                username,
                language,
                source_code,
                stdin,
                stdout
            }
        });
        // Fetch existing data from Redis
        const existingData = await client.get('data');
        // Parse existing data if it exists, otherwise initialize an empty array
        const dataArray = existingData ? JSON.parse(existingData) : [];
        // Add the new submission to the data array
        dataArray.push(submission);
        // Store the updated data array in Redis
        await client.set('data', JSON.stringify(dataArray));
        res.status(201).json(submission);
    }
    catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Error inserting data' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
