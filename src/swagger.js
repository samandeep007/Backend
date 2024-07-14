// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import "dotenv/config";

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'This is a Node.js application that provides a RESTful API for managing notes. It uses Express.js as the Ib framework, MongoDB as the database, and includes user authentication.',
    },
    servers: [
      {
        url: process.env.BASE_URL, // Change this to your server's URL
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
