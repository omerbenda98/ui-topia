# README.md

# Next.js Application with MongoDB

This is a Next.js application that uses MongoDB and NextAuth for authentication.

## Prerequisites

- Docker
- Docker Compose
- MongoDB Atlas cluster (or other MongoDB cluster)

## Getting Started

1. Clone the repository
2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in the environment variables in `.env`:

   - `MONGODB_URI`: Your full MongoDB cluster connection string
   - `GOOGLE_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js session encryption
   - The other variables can remain as they are unless you need custom URLs

4. Build and run the container:

   ```bash
   docker-compose up --build
   ```

5. Access the application at http://localhost:3000

## Environment Variables

- `MONGODB_URI`: Your MongoDB cluster connection string (e.g., mongodb+srv://...)
- `GOOGLE_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXTAUTH_URL`: The base URL of your application
- `NEXTAUTH_URL_INTERNAL`: Internal URL for NextAuth
- `NEXTAUTH_SECRET`: Secret key for NextAuth session encryption

## Docker Commands

- Start the application:

  ```bash
  docker-compose up
  ```

- Stop the application:

  ```bash
  docker-compose down
  ```

- Rebuild the container:

  ```bash
  docker-compose up --build
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

## Development

The application runs in production mode inside Docker. For development:

1. Install dependencies locally:

   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
