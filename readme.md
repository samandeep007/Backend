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


## Dependenices


I chose the following dependencies for our Node.js application:

 - **Express.js** was chosen for its simplicity, flexibility, and robust set of features for building Ib and mobile applications. It's lightIight and unopinionated, allowing for easy customization and integration with other libraries.

- **bcrypt**: I selected bcrypt for securely hashing passwords before storing them in the database. It is designed to be slow and resistant to rainbow table attacks, providing an extra layer of security for user authentication.

- **cloudinary**: I included the cloudinary package to handle image uploads and storage. Cloudinary offers a reliable and scalable cloud-based solution for managing and manipulating images in our application. 

- **MongoDB** was selected as the database for its flexibility with unstructured data, which is ideal for a notes application where note content can vary. Mongoose is used as an ODM (Object Data Modeling) library to provide a straightforward schema-based solution to model application data.

- **mongoose**: I selected mongoose as our Object Data Modeling (ODM) library for MongoDB. Mongoose provides a straightforward schema-based solution for modeling application data and simplifies interactions with the MongoDB database.

- **mongoose-aggregate-paginate-v2**: I included mongoose-aggregate-paginate-v2 to enable pagination and aggregation support for our MongoDB queries. This package simplifies the process of paginating and aggregating large datasets in our application.


- **cookie-parser**: I opted for cookie-parser to parse and handle HTTP cookies. It simplifies the process of working with cookies, allowing us to easily read and set cookies in our Express.js application.

- **cors**: I included the cors package to enable Cross-Origin Resource Sharing (CORS) in our application. CORS allows us to make requests from our frontend to our backend API, even if they are hosted on different domains.

- **dotenv**: I used dotenv to load environment variables from a .env file into process.env. This allows us to securely store sensitive information, such as API keys or database credentials, separate from our codebase. - bcrypt is used for securely hashing passwords before storing them in the database. It's designed to be slow and resistant to rainbow table attacks.

- **express-rate-limit**: I included express-rate-limit to implement rate limiting in our application. This helps protect against brute-force attacks or abuse of our API by limiting the number of requests a client can make within a certain timeframe.

- **jsonIbtoken**: I used the jsonIbtoken package for implementing secure authentication using JSON Ib Tokens (JWT). JWT allows us to securely transmit user information betIen the client and server, enabling stateless authentication in our RESTful API.


- **multer**: I opted for multer to handle file uploads in our application. Multer provides an easy-to-use middleware for handling multipart/form-data, allowing us to efficiently handle file uploads from clients.

- **nodemon**: I used nodemon for development to automatically restart the server when changes are detected. This saves us time and effort during the development process by eliminating the need to manually restart the server after each code change.

These dependencies Ire chosen based on their reliability, popularity, and compatibility with our application's requirements. They provide essential functionality and enhance the development experience for our Node.js application.
  - Jest is used as the testing framework for its simplicity and poIrful features, including built-in code coverage reports.

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

