# Weather API

## Overview
The Weather API is a server-side application built using the NestJS framework. It provides endpoints for fetching weather data and managing user subscriptions for weather updates. The application is designed to be scalable, efficient, and easy to deploy.

## Application Flow

### 1. Weather Data Retrieval
- **Endpoint**: `GET /api/weather`
- **Description**: Fetches the current weather for a specified city.
- **Flow**:
  1. The `WeatherController` receives the request with the city name as a query parameter.
  2. The `WeatherService` fetches weather data from an external API using the `HttpService`.
  3. The response includes temperature, humidity, and a weather description.

### 2. Subscription Management
- **Endpoints**:
  - `POST /api/subscriptions/subscribe`: Subscribe to weather updates.
  - `GET /api/subscriptions/confirm/:token`: Confirm email subscription.
  - `GET /api/subscriptions/unsubscribe/:token`: Unsubscribe from weather updates.
- **Flow**:
  1. The `SubscriptionController` handles subscription-related requests.
  2. The `SubscriptionService` interacts with the database to manage subscription entities.
  3. Emails are sent using the `MailService` for confirmation and updates.

### 3. Email Notifications
- **Description**: Sends email notifications for subscription confirmation and weather updates.
- **Flow**:
  1. The `MailService` uses `nodemailer` and Google OAuth2 for secure email delivery.
  2. Emails include links for confirming or unsubscribing from subscriptions.

## Key Components

### 1. Controllers
- **`WeatherController`**: Handles weather-related requests.
- **`SubscriptionController`**: Manages subscription-related operations.

### 2. Services
- **`WeatherService`**: Fetches weather data from external APIs.
- **`SubscriptionService`**: Handles subscription logic and database interactions.
- **`MailService`**: Sends emails for subscription confirmation and updates.

### 3. Modules
- **`WeatherModule`**: Encapsulates weather-related functionality.
- **`SubscriptionModule`**: Encapsulates subscription-related functionality.
- **`MailModule`**: Encapsulates email-related functionality.
- **`CoreModule`**: Provides shared services like configuration and database connection.

## Environment Variables
The application uses the following environment variables:

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `PORT`               | Port for the application to run on. |
| `DB_HOST`            | Database host.                      |
| `DB_PORT`            | Database port.                      |
| `DB_USER`            | Database username.                  |
| `DB_PASS`            | Database password.                  |
| `DB_NAME`            | Database name.                      |
| `GMAIL_USER`         | Gmail account for sending emails.   |
| `GMAIL_CLIENT_ID`    | Google OAuth2 client ID.            |
| `GMAIL_CLIENT_SECRET`| Google OAuth2 client secret.        |
| `GMAIL_REFRESH_TOKEN`| Google OAuth2 refresh token.        |
| `APP_URL`            | Base URL of the application.        |

## Running the Application

### Development
```bash
npm install
npm run start:dev
```

### Production
```bash
npm run build
npm start
```

### Docker
Use the provided `Dockerfile` and `docker-compose.yml` to build and run the application in a containerized environment.

```bash
docker-compose up --build
```

## API Documentation
The application includes Swagger documentation available at `/api-docs` when the application is running.

## License
This project is licensed under the MIT License.
