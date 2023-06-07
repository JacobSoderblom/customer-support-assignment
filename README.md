# Customer Support Assignment

## How to start

Install dependencies

```
npm install
```

Setup environment

First create a new .env file in the root of the application, then copy and paste the values below into that file.

```
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET="eYhSwYxGfgWe9TylfC8WPnjOgE0qSKe8lNgrjjwdcA0="
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="secret"

```

Initiate database

```
npx prisma db push
npm run db-seed
```

Build the project

```
npm run build
```

Start the Application

```
npm run start
```

## Accounts

The application will seed two accounts that can be used to sign in.

```
admin@customersupport.com / admin
agent1@customersupport.com / agent1
```
