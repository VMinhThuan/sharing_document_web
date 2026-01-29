# Backend Development Rules

## Folder Structure

- all code must be in `src` folder.
- `src` should contain:
  - `configs`: Configuration files (DB, env, etc).
  - `controllers`: Handle HTTP requests and responses.
  - `middlewares`: Express middlewares.
  - `models`: Mongoose models.
  - `routes`: API route definitions.
  - `services`: Business logic and database interactions.
  - `validations`: Request validation logic (e.g., Joi).
- Entry point: `src/server.js`.

## Code Convention & Architecture

- **Controller Import**: Import controllers as a single object (e.g., `const authController = require('../controllers/auth.controller')`) and access methods via dot notation (e.g., `authController.register`) to keep route definitions clean.
- **Service Layer Pattern**: All business logic and database operations MUST be in `services`. Controllers should only handle parsing, validating requests, calling services, and sending responses.
- **API Prefix**: All APIs must start with `/api/v1`.
- **Response Format**:
  - **Success**:
    ```json
    {
       "statusCode": number,
       "error": null,
       "message": string,
       "data": any
    }
    ```
  - **Failure**:
    ```json
    {
       "statusCode": number,
       "error": string, // Exception message or error code
       "message": string,
       "data": null
    }
    ```

## Authentication & Security

- Use `bcryptjs` for password hashing.
- Use `jsonwebtoken` (JWT) for authentication.
- Protected routes must use the auth middleware.

## Dependencies

- express, mongoose, dotenv, cors, helmet, jsonwebtoken, bcryptjs.
