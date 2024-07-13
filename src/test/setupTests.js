// Import @babel/register to transform code
import '@babel/register';

// Import necessary modules
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from 'sinon'; // Import Sinon for mocking
import Mocha from 'mocha';

let mongoServer;


// Mocha hooks for setup and teardown
before(async () => {
    this.timeout(60000);
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(() => {
    // Reset mocks if necessary
    sinon.restore(); // Restore all sinon stubs and mocks
});
