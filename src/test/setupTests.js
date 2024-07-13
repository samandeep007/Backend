// tests/setupTests.js
import '@babel/register'; // Ensure Babel is registered for transforming code

// Optionally, add any setup code here, like global mocks or database setup

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(() => {
    // Reset mocks if necessary
    jest.clearAllMocks();
});


