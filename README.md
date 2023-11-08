# API Documentation

This is the documentation for the authentication REST API. To use this API, send requests to [API URL], followed by an endpoint.

## Endpoints

## `POST` `/signup`

### Request

#### Body

`email` - The new user's email address.

`password` - The new user's password.

### Response (Success)

#### Status Code

`201`

#### Body

`message` - A message stating the success.

### Response (Error, invalid data)

#### Status Code

`400`

#### Body

`message` - A message describing the error.

### Example Call (node.js)

```javascript
const response = await fetch(`[API URL]/signup`, {
  method: "POST",
  body: JSON.stringify({
    email: "john@gmail.com",
    password: "password123",
  }),
});

if (!response.ok) {
  const { message } = await response.json();
  throw new Error(message);
}
```

## `POST` `/login`

### Request

#### Body

`email` - The user's email address.

`password` - The user's password.

### Response (Success)

#### Status Code

`200`

#### Body

`message` - A message stating the success.

`token` - The JWT auth token to send to `/authenticate`.

### Response (Error, invalid data)

#### Status Code

`400`

#### Body

`message` - A message describing the error.

### Example Call (node.js)

```javascript
const response = await fetch(`[API URL]/login`, {
  method: "POST",
  body: JSON.stringify({
    email: "john@gmail.com",
    password: "password123",
  }),
});

if (!response.ok) {
  const { message } = await response.json();
  throw new Error(message);
}

const { token } = await response.json();
// Save the token for later...
```

## `POST` `/authenticate`

### Request

#### Body

`token` - The token recieved from `/login`.

### Response (Success)

#### Status Code

`200`

#### Body

`message` - A message stating the success.

`user` - The user data

### Response (Error, invalid data)

#### Status Code

`400`

#### Body

`message` - A message describing the error.

### Example Call (node.js)

```javascript
// Get the saved auth token
// const token = ...;

const response = await fetch(`[API URL]/authenticate`, {
  method: "POST",
  body: JSON.stringify({
    token: token,
  }),
});

if (!response.ok) {
  const { message } = await response.json();
  throw new Error(message);
}

const { user } = await response.json();
// The user is authenticated, grant access...
```
