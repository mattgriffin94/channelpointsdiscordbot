import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDatabase(): Promise<void> {
    try {
        await client.connect();
        console.log('Connected to the local MongoDB instance');
    } catch (error) {
        console.error('Error connecting to the local MongoDB instance:', error);
    }
}

export { connectToDatabase, client };


