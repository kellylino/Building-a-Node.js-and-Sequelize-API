# Phone Directory Application

## Overview

This is a simple Phone Directory application built using Node.js, Express, and Sequelize ORM with an SQLite database. The app allows users to manage their phone numbers and associated user information. It supports CRUD (Create, Read, Update, Delete) operations for both users and their phone numbers.

## Features

- **Users**: Create, read, update, and delete users.
- **Phone Numbers**: Add, retrieve, update, and delete phone numbers for users.
- **Search**: Search for users by their first name, last name, or by phone number.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle HTTP requests.
- **Sequelize**: ORM for interacting with the SQLite database.
- **SQLite**: Lightweight database used for storing users and phone numbers.
- **Joi**: Validation library for input validation.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [SQLite](https://www.sqlite.org/) (for local development)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/phone-directory-app.git
    cd phone-directory-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the application:**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:5050`.

4. **Access the API:**

    - Users: `/user`
    - Phones: `/phone`

    You can test the endpoints using tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

## API Endpoints

### User Routes

- `GET /user`: Get a list of all users.
- `GET /user/:id`: Get a specific user by ID.
- `GET /user/search/name`: Search for a user by first and last name.
- `GET /user/search/nameAndNumber`: Search for a user by first name, last name, and phone number.
- `POST /user`: Create a new user.
- `PUT /user/:id`: Update a user's information by ID.
- `DELETE /user/:id`: Delete a user by ID.

### Phone Routes

- `GET /phone`: Get a list of all phone numbers.
- `GET /phone/:id`: Get a specific phone number by ID.
- `GET /phone/search/number`: Search for a phone number.
- `POST /phone`: Add a new phone number.
- `PUT /phone/:id`: Update a phone number by ID.
- `DELETE /phone/:id`: Delete a phone number by ID.

## Database Schema

### User Table

| Field       | Type    | Description               |
|-------------|---------|---------------------------|
| `id`        | Integer | Primary key, auto-incremented |
| `first_name`| String  | User's first name         |
| `last_name` | String  | User's last name          |
| `city`      | String  | User's city               |
| `address`   | String  | User's address            |

### Phone Table

| Field       | Type    | Description               |
|-------------|---------|---------------------------|
| `id`        | Integer | Primary key, auto-incremented |
| `number`    | String  | Phone number (unique)     |
| `comment`   | String  | Optional comment for phone |
| `UserId`    | Integer | Foreign key to the User   |

## Validation

- **Phone Numbers**: Must be a unique number.
- **Users**: Must have a first name, last name, city, and address.

## Error Handling

- **400 Bad Request**: Invalid input or missing parameters.
- **404 Not Found**: Requested resource not found.
- **500 Internal Server Error**: Unexpected server error.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.
