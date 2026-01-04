# FinEdge

Personal Finance & Expense Tracker API built with Node.js, Express, MongoDB, and Mongoose.

> Note: This README was generated with AI assistance.

## Features

- User registration & login (JWT)
- Transactions (credit/debit/transfer)
- Budgets (monthly)
- Analytics endpoints (filters, totals, trends)
- AI suggestions endpoint (savings)
- Standard success response DTO and centralized error handling

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Jest (unit tests)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection string (Atlas or local)

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root(refer .example.env file for neccesary configurations)

Required:

- `DB_URL` - MongoDB connection string
- `JWT_SECRET` - secret used to sign/verify JWT tokens

Optional:

- `PORT` - default: `3000`
- `DB_NAME` - database name (optional, used when connecting)
- `JWT_EXPIRES_IN` - default: `12h`
- `SALT_ROUNDS_FOR_PASSWORD` - default: `10`

### Run

```bash
npm start
```

For auto-reload during development:

```bash
npm run dev
```

Health check:

- `GET /health`

## Scripts

- `npm start` - starts the server (`node app.js`)
- `npm run dev` - starts with nodemon
- `npm test` - runs all Jest tests
- `npm run test:file -- path/to/testfile.test.js` - runs a specific test file

## API

Base path: `/api/v1`

### Authentication

Most routes require JWT auth.

Send the token in the header:

```
Authorization: Bearer <token>
```

### Users

- `POST /api/v1/users` - register
- `POST /api/v1/users/login` - login (returns token)
- `GET /api/v1/users/preferences` - get preferences (auth)
- `GET /api/v1/users/:userId` - get user by id (auth)
- `GET /api/v1/users` - list users (auth)

### Transactions (auth required)

- `POST /api/v1/transactions` - create a transaction
- `GET /api/v1/transactions` - list transactions
- `PUT /api/v1/transactions/:id` - update transaction

### Budgets (auth required)

- `POST /api/v1/budgets` - create a budget
- `GET /api/v1/budgets` - list budgets (supports query filters: `year`, `month`, `status`)
- `GET /api/v1/budgets/:id` - get budget by id

### Analytics (auth required)

- `GET /api/v1/analytics/filter`
- `GET /api/v1/analytics/totals`
- `GET /api/v1/analytics/trends`

### AI (auth required)

- `GET /api/v1/ai/savings`

## Response Format

### Success responses

Most success responses follow the `GenericResponse` DTO shape:

```json
{
	"success": true,
	"message": "...",
	"data": {}
}
```

### Error responses

Errors are handled by a global error middleware and return:

```json
{
	"name": "BadRequestError",
	"message": "...",
	"httpCode": 400,
	"statusCode": "FinEdge Bad Request",
	"errorCode": "BDRQ001",
	"details": "..."
}
```

## Debugging (VS Code + Nodemon)

- Use the VS Code Run & Debug configuration: **Debug (nodemon)**
- Set breakpoints in controllers/services and start debugging

## Testing

Run all tests:

```bash
npm test
```

Run a single test file:

```bash
npm test -- test/src/userController.test.js
```

## Contributors

Contributors below are derived from git history (unique authors):

- Akshay Patwari (learn.akshay.patwari@gmail.com)
- Sai Prasath (sai20prasath@gmail.com)
