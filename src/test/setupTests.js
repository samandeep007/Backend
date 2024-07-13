// Import necessary modules
require('@babel/register'); // Ensure Babel is registered for transforming code

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const sinon = require('sinon'); // Import Sinon for mocking

let mongoServer;

// Mocha hooks for setup and teardown
before(async function () {
    this.timeout(60000); // Increase timeout to ensure MongoMemoryServer has enough time to start
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
