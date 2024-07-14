# Notes API

This is a Node.js application that provides a RESTful API for managing notes. It uses Express.js as the Ib framework, MongoDB as the database, and includes user authentication.


## Why MERN Stack?

For this Notes API project, I chose the MERN (MongoDB, Express.js, React, Node.js) stack due to its numerous advantages and suitability for our specific requirements:

1. **JavaScript Everywhere**: MERN allows us to use JavaScript throughout the stack, from the frontend to the backend. This consistency reduces context switching and allows for code reuse betIen client and server.

2. **MongoDB's Flexibility**: As a NoSQL database, MongoDB offers schema flexibility, which is ideal for a notes application where note structure might vary. It also scales Ill, supporting potential future growth of our application.

3. **Express.js Simplicity**: Express.js provides a minimal and flexible set of features for Ib and mobile applications. It's unopinionated, allowing us to structure our application as I see fit.

4. **React's Component-Based Architecture**: Although not directly used in this backend project, React's component-based structure is perfect for building the frontend of a notes application, allowing for reusable UI elements and efficient updates.

5. **Node.js Performance**: Node.js's event-driven, non-blocking I/O model makes it lightIight and efficient, perfect for data-intensive real-time applications like our Notes API.

6. **NPM Ecosystem**: The Node Package Manager (NPM) provides access to a vast ecosystem of open-source packages, accelerating development and providing solutions for common tasks.

7. **JSON Data Format**: All components of MERN work seamlessly with JSON, making data transfer betIen client, server, and database efficient and straightforward.

8. **Scalability**: The MERN stack is known for its scalability, which is crucial if our Notes application grows in the future.

9. **Strong Community Support**: MERN technologies have large, active communities, ensuring good documentation, regular updates, and a Ialth of resources for problem-solving.

10. **Cost-Effective**: Being open-source, MERN stack technologies are free to use, reducing development costs.

While other stacks like LAMP (Linux, Apache, MySQL, PHP) or MEAN (MongoDB, Express.js, Angular, Node.js) are also popular choices, MERN's JavaScript consistency, flexibility, and suitability for real-time applications made it the ideal choice for our Notes API project.


## Dependencies

Key dependencies for our Node.js application and reasons for their selection:

- **Express.js**: Chosen for simplicity, flexibility, and robust features in building web and mobile applications.

- **bcrypt**: Selected for secure password hashing, resistant to rainbow table attacks.

- **cloudinary**: Included for reliable, scalable cloud-based image management.

- **MongoDB**: Chosen for flexibility with unstructured data, ideal for varied note content.

- **mongoose**: Selected as ODM for MongoDB, simplifying data modeling and database interactions.

- **mongoose-aggregate-paginate-v2**: Enables efficient pagination and aggregation of large datasets.

- **cookie-parser**: Simplifies parsing and handling of HTTP cookies in Express.js.

- **cors**: Enables secure cross-origin requests between frontend and backend.

- **dotenv**: Allows secure storage of sensitive information separate from codebase.

- **express-rate-limit**: Implements rate limiting to protect against API abuse.

- **jsonwebtoken**: Enables secure, stateless authentication using JSON Web Tokens.

- **multer**: Efficiently handles file uploads with easy-to-use middleware.

- **nodemon**: Enhances development by auto-restarting the server upon code changes.

- **Jest**: Chosen for its simplicity and powerful testing features, including code coverage reports.

These dependencies were selected based on reliability, community support, and specific project requirements.

## Setup and Installation

1. Clone the repository:
2. Install dependencies using `npm install`:
3. Create a `.env` file in the root directory and add the following variables:

```
PORT = your_local_port
MONGODB_URI = your_mongodb_uri
CORS_ORIGIN = *


ACCESS_TOKEN_SECRET = your_auth_secret
ACCESS_TOKEN_EXPIRY = 1d

REFRESH_TOKEN_SECRET = your_refreshToken_secret
REFRESH_TOKEN_EXPIRY = 10d


CLOUDINARY_CLOUD_NAME = cloudinary_name
CLOUDINARY_API_KEY = api_key
CLOUDINARY_API_SECRET = api_secret

``` 



4. Start the server 
```bash 
npm run dev
```
The server should now be running on `http://localhost:3000`.

## Running Tests
 Create a `.env.test` file in the root directory and add the following variable:

 ```
 ACCESS_TOKEN_SECRET = your_accessToken_secret
 ```


To run the tests, use the following command:
This will run all tests using Jest. The test files are located in the `src/tests` directory.

```bash 
npm test
```

## API Endpoints



### Authentication Endpoints

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Log in to an existing user account and receive an access token.

### Protected auth routes
- `POST /api/auth/logout`: Log out the current user.
- `POST /api/auth/refresh-token`: Refresh the access token.
- `POST /api/auth/change-password`: Change the password for the current user.
- `GET /api/auth/current-user`: Get the details of the current user.
- `PATCH /api/auth/update-account`: Update the details of the current user, including uploading an avatar image.


### Note Endpoints

- `GET /api/notes`: Get a list of all notes for the authenticated user.
- `GET /api/notes/:id`: Get a note by ID for the authenticated user.
- `POST /api/notes`: Create a new note for the authenticated user.
- `PUT /api/notes/:id`: Update an existing note by ID for the authenticated user.
- `DELETE /api/notes/:id`: Delete a note by ID for the authenticated user.
- `POST /api/notes/:id/share`: Share a note with another user for the authenticated user.
- `GET /api/search?q=:query`: Search for notes based on keywords for the authenticated user.

All note endpoints require authentication. Make sure to include the access token in the request header.

