# Frontend Development Rules

## Folder Structure

- **Pages**:
  - Admin pages must be in `src/pages/admin`.
  - Client pages must be in `src/pages/client`.
- **Services**:
  - All API calls must be defined in `src/services/api.js`.
  - Axios configuration and interceptors must be in `src/services/axios.customize.js`.
- **Components**:
  - Break down UI into reusable components in `src/components`.

## API Integration

- Use the `axios` instance exported from `src/services/axios.customize.js`.
- Response handling should respect the backend format: `{ statusCode, error, message, data }`.

## Authentication & Authorization

- Use `AuthContext` (or similar) to manage user state.
- Protect `/admin` routes: Only users with `role: 'admin'` can access.
- Redirect unauthorized users to a 403 pages or Login.

## Routing

- Define routes in `App.jsx`.
- Use `react-router-dom`.
- Handle 404 (Not Found) for undefined routes.
