## Application Flow

### Weather Data Retrieval
- **Endpoint**: `GET /weather`
- **Description**: Retrieves the current weather for a specified city.
- **How It Works**:
  1. A `GET` request is sent to the API with the city name as a query parameter.
  2. The system checks if the city data is available in the database or cache.
  3. If not found, the `WeatherService` fetches the data from an external weather API.
  4. The processed data, including temperature, humidity, and weather description, is returned to the user.

### Subscription Management
- **Endpoints**:
  - `POST /subscribe`: Subscribe to weather updates.
  - `GET /confirm/:token`: Confirm email subscription.
  - `GET /unsubscribe/:token`: Unsubscribe from weather updates.
- **How It Works**:
  1. Users interact with the API to manage their subscriptions.
  2. The system validates requests and updates subscription records in the database.
  3. Emails are sent for subscription confirmation and updates using the `MailService`.

### Email Notifications
- **Description**: Sends email notifications for subscription confirmation and weather updates.
- **How It Works**:
  1. Notifications are triggered by user actions or scheduled updates.
  2. The `MailService` uses `nodemailer` with Google OAuth2 for secure email delivery.
  3. Emails include links for confirming or unsubscribing from subscriptions.

## Key Components

### Controllers
- **`WeatherController`**: Handles weather-related requests.
- **`SubscriptionController`**: Manages subscription-related operations.

### Services
- **`WeatherService`**: Fetches weather data from external APIs.
- **`SubscriptionService`**: Handles subscription logic and database interactions.
- **`MailService`**: Sends emails for subscription confirmation and updates.

### Modules
- **`WeatherModule`**: Encapsulates weather-related functionality.
- **`SubscriptionModule`**: Encapsulates subscription-related functionality.
- **`MailModule`**: Encapsulates email-related functionality.
- **`CoreModule`**: Provides shared services like configuration and database connection.

## Environment Variables
The application relies on the following environment variables:

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
| `APP_URL`            | Base URL of the application.        

## Additional Notes
- The application is built using the NestJS framework.
- It uses TypeORM for database interactions.
- Scheduled tasks are implemented for periodic weather updates.

