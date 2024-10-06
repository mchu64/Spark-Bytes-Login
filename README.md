# CS392 Course Project: Spark Bytes

Spark Bytes is a platform for Boston University students and faculty members to post events that provide foods or snacks. The aim is to reduce food waste resulting from over-purchasing for events and at the same time, help students access free food.

## Installation Guide

### Server
Navigate to `server` folder, and run `npm install` to install all dependencies. 

Create a `.env` file and add the following lines:

```
POSTGRES_PASSWORD=password
POSTGRES_USER=postgres
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
JWT_TOKEN_SECRET=asupersecretthing
```

Run `docker compose up` to start the database. This will create a container running the database management system, PostgreSQL.

Next, we need to run a database migration tool to setup the database tables. In a new terminal window, run `npx prisma migrate deploy`.
You should see that all schemas have successfully been applied. 

_NOTE_: The database has to be running for migration to be successful.

Then, run `npm run dev` to start the Express backend server. The server will connect to the database we've launched and configured.

### Client

In another new terminal window, navifate to the `client` folder, and run `npm install` to install all dependencies. Then, run `npm run dev` to start the development server.

## Features

1. **Signup & Login:** Users can register and select their event preferences. Upon successful login, a JWT token is provided for authentication.
   
2. **Profile:** [Future sprint] Users can view and edit their profiles, and see the events they've posted.
   
3. **Events:** [Future sprint] Displays all available events. Users can filter these events based on tags.
   
4. **Create Events:** [Future sprint] Authorized users, approved by admins, can post events and add associated images.

## Technologies & Frameworks

- **Frontend:** Next.js (TypeScript)
- **Backend:** Express.js (TypeScript)
- **Authentication:** JSON Web Token (JWT) and bcrypt for password encryption.
- **Database:** Users can also use `docker-compose.yml` to set up a local PostgreSQL container.
- **Hosting:** Currently undecided for client-side, but considering Netlify.
- **CI/CD:** GitHub Actions (setup in progress).

## Directory Structure

- `/client`: Holds all client-side code
    - `/client/src/common`: Contains frequently used files like constants or interfaces.
    - `/client/src/components`: Currently holds the loading components, more components like navbar can be added.
    - `/client/src/contexts/AuthContext.tsx`: Wrapper around `_app.tsx` to manage authentication context.
    - `/client/src/pages`: Contains all frontend pages.
    
- `/server`: Contains all server-side code
  - `/server/server.ts` contains the code to start the server.
  - `/server/app` contains the majority of the code for the server.
    - Each folder in `/server/app` contains the code for a specific feature.

