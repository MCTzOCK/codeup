# REST API

The following document tells you how to use the REST API of CodeUp.
The {base-url} marker represents "https://codeup.space" in production
and "http://localhost:3000" in development.

## Accounts

### Register

`POST /api/account/register`

Post Data (body)

| Property  | Type     | Description                | Required |
|-----------|----------|----------------------------|----------|
| email     | `string` | The E-Mail of the new user | true     |
| firstName | `string` | The first name             | true     |
| lastName  | `string` | The last name              | true     |
| password  | `string` | The password               | true     |
| username  | `string` | The username of the user   | true     |

#### Responses

- Status: 400; error: "Username must be between 4 and 20 characters long and can only contain letters, numbers, and the
  underscore"
    - Invalid username
- Status: 400; error: "Invalid fields"
    - Some required fields are not submitted or the types do not match.
- Status: 500, error: any
    - Any Server related error, most likely a MongoDB error that the `username` or `email` is not valid.
- Status: 200, success: true, message: "User created - Please check your email for an activation link"
    - Everything worked just fine

### Login

`POST /api/account/login`

Post Data (body)

| Property | Type     | Description            | Required |
|----------|----------|------------------------|----------|
| email    | `string` | The E-Mail of the user | true     |
| password | `string` | The password           | true     |
| code     | `string` | The 2FA Code           | false    |

#### Responses

- Status: 400; error: "Missing required fields"
    - Some required fields are not submitted or the types do not match.
- Status: 400; error: "User not found"
    - The account does not exist
- Status: 400; error: "Wrong password"
    - The password does not match to the accounts' password.
- Status: 400; error: "Wrong code"
    - The 2FA Code is not valid
- Status: 200; error: null; _2fa: true
    - The user received an e-mail containing the 2FA Code
- Status: 200, success: true, token: JWT
    - Everything worked just fine and you got an access token

### Reset

`POST /api/account/reset`

Post Data (body)

| Property | Type     | Description            | Required |
|----------|----------|------------------------|----------|
| email    | `string` | The E-Mail of the user | true     |

#### Responses

- Status: 400; error: "Missing parameters"
    - Some required fields are not submitted or the types do not match.
- Status: 404; error: "User not found"
    - The account does not exist
- Status: 400; error: "Reset E-Mail already sent"
    - The E-Mail to reset the password was already sent
- Status: 200, success: true, message: "Reset E-Mail sent"
    - Everything worked just fine and the user got an E-Mail

### Reset-Confirm

`POST /api/account/reset-confirm`

Post Data (body)

| Property | Type     | Description      | Required |
|----------|----------|------------------|----------|
| token    | `string` | The Reset Token  | true     |
| password | `string` | The new Password | true     |

#### Responses

- Status: 400; error: "Missing required fields"
    - Some required fields are not submitted or the types do not match.
- Status: 400; error: "Invalid Token"
    - The Reset Token is not valid
- Status: 400; error: "Password must be at least 8 characters long and contain at least one uppercase letter, one
  lowercase letter, one number and one special character"
    - The password is not safe enough
- Status: 200, success: true, message: "Password changed successfully"
    - Everything worked just fine

### Update

`POST /api/account/update`

Post Data (body)

| Property | Type                                    | Description                    | Required |
|----------|-----------------------------------------|--------------------------------|----------|
| token    | `string`                                | A JWT Access Token of the user | true     |
| keyName  | `firstName`, `lastName`, `email`, `2fa` | The key to be modified         | true     |
| keyValue | `string`                                | The new value                  | true     |

#### Responses

- Status: 400; error: "Missing parameters"
    - Some required fields are not submitted or the types do not match.
- Status: 404; error: "User not found"
    - The account does not exist
- Status: 400; error: "Invalid key name"
    - Invalid `keyName` value
- Status: 400; error: "Invalid email"
    - Invalid email in `keyValue`
- Status: 400; error: "Email change code already sent"
    - The E-Mail last changed to was not confirmed yet.
- Status: 400; error: "Email already in use"
    - The E-Mail provided is already used by another account
- Status: 401; error: "Invalid token"
    - The provided `token` is not valid.
- Status: 200, success: true, message: "Please check your email for a verification code"
    - Everything worked just fine and the user got an E-Mail
- Status: 200, success: true, newToken: JWT
    - Everything worked just fine and a new JWT was generated

### Check-Reset-Token

`GET /api/account/check-reset-token`

Post Data (query -> ?key=value&key2=value2...)

| Property | Type     | Description      | Required |
|----------|----------|------------------|----------|
| token    | `string` | The Reset Token  | true     |

#### Responses

- Status: 400; error: "Missing token"
    - The Reset Token was not provided
- Status: 400; error: "Invalid Token"
    - The Reset Token is not valid
- Status: 200; valid: true
    - The Reset Token is valid

### Action

`GET /api/account/action`

***CAN NOT BE USED PROGRAMMATICALLY***
