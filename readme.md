# Notes API

This is a Node.js application that provides a RESTful API for managing notes. It uses Express.js as the Ib framework, MongoDB as the database, and includes user authentication.


## Why Express??

We chose Express.js for this Notes API application due to its:

1. Simplicity and minimalism, allowing for quick setup and easy learning curve.
2. Flexibility in structuring the application, enabling us to organize routes and middleware as needed.
3. Large and active community, providing extensive resources and third-party middleware.
4. High performance and scalability, suitable for building robust RESTful APIs.
5. Excellent compatibility with Mongo and other Node.js packages we're using.
6. Middleware-based architecture, allowing easy integration of additional functionalities.
7. Strong documentation and widespread industry adoption, ensuring long-term support and reliability.



## Dependencies

Key dependencies for our Node.js application:

- **Express.js**: Web application framework for its simplicity and robust features
- **bcrypt**: Secure password hashing to protect user credentials
- **cloudinary**: Cloud-based image management for efficient handling of user avatars
- **MongoDB**: Flexible, document-oriented database ideal for storing varied note content
- **mongoose**: MongoDB object modeling tool to simplify data interactions
- **mongoose-aggregate-paginate-v2**: Pagination and aggregation for managing large datasets efficiently
- **cookie-parser**: HTTP cookie handling for maintaining user sessions
- **cors**: Cross-origin resource sharing to enable frontend-backend communication
- **dotenv**: Environment variable management for secure configuration
- **express-rate-limit**: API request rate limiting to prevent abuse
- **jsonwebtoken**: Secure, stateless authentication for user authorization
- **multer**: File upload handling for user avatar uploads
- **nodemon**: Development server auto-restart to enhance developer productivity
- **Jest**: Testing framework with code coverage for comprehensive test suites

Selected for reliability, community support, and project-specific needs.

## Setup and Installation

1. Clone the repository:
2. Install dependencies using `npm install`:
3. Create a `.env` file in the root directory and add the following variables:

```
PORT = your_local_port
BASE_URL = http://localhost:3000 
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
node index
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

