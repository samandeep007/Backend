// Import @babel/register to transform code
import '@babel/register';

// Import necessary modules
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from 'sinon'; // Import Sinon for mocking

let mongoServer;

// Jest setup and teardown hooks
beforeAll(async () => {
    // Increase the timeout if needed
    jest.setTimeout(60000);

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Ensure mongoose is not already connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(() => {
    // Reset mocks if necessary
    sinon.restore(); // Restore all sinon stubs and mocks
});
