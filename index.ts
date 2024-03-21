// index.js
require('dotenv').config()
import express from 'express';
import { PrismaClient } from '@prisma/client';
import e, { Request, Response } from 'express'
import cors from 'cors'
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

async function connectToRedis() {
    const connection = await client.connect();
    console.log(connection);
}

connectToRedis();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());

app.get('/submissions', async (req: any, res: any) => {
    try {
        const values = await client.get('data');
        // values && console.log("data from redis", JSON.parse(values));

        if (values != null) res.json(JSON.parse(values));
        else {
            const submissions = await prisma.submissions.findMany();
            await client.set("data", JSON.stringify(submissions))
            res.json(submissions);
        }
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'An error occurred while fetching submissions' });
    }
});

app.post('/submissions', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Error inserting data' });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
