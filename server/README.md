# Restaurant Backend Server

Go backend server for handling Stripe payment integration.

## Prerequisites

- Go 1.21 or higher ([Install Go](https://golang.org/doc/install))
- Stripe account with API keys ([Get Stripe Keys](https://dashboard.stripe.com/test/apikeys))

## Setup

1. **Install Go dependencies**:
   ```bash
   cd server
   go mod download
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
   PORT=3000
   ```

3. **Run the server**:
   ```bash
   go run main.go
   ```

   Or build and run:
   ```bash
   go build -o restaurant-backend
   ./restaurant-backend
   ```

## API Endpoints

### Create Payment Intent

**Endpoint**: `POST /api/create-payment-intent`

**Request Body**:
```json
{
  "amount": 5200,
  "currency": "inr"
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Environment Variables

- `STRIPE_SECRET_KEY` - Your Stripe secret key (required)
- `PORT` - Server port (default: 3000)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: *)

## Testing

1. Start the server:
   ```bash
   go run main.go
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

3. Test payment intent creation:
   ```bash
   curl -X POST http://localhost:3000/api/create-payment-intent \
     -H "Content-Type: application/json" \
     -d '{"amount": 5200, "currency": "inr"}'
   ```

## Development

The server runs on `http://localhost:3000` by default.

Make sure the React Native app's `API_BASE_URL` in `src/constants/api.ts` points to:
```
http://localhost:3000/api
```

For production, update the `API_BASE_URL` to your deployed server URL.

## Security Notes

- Never commit `.env` file with actual secret keys
- Use environment variables for sensitive data
- In production, set `ALLOWED_ORIGINS` to specific domains
- Use HTTPS in production
- Keep your Stripe secret key secure

## Troubleshooting

**Error: "stripe: API key is required"**
- Make sure `STRIPE_SECRET_KEY` is set in `.env` file

**Error: "port already in use"**
- Change the `PORT` in `.env` or stop the process using port 3000

**CORS errors from React Native app**
- Verify `ALLOWED_ORIGINS` includes your app's origin
- For development, `*` allows all origins

