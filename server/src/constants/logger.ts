export const LOG_MESSAGES = {
  AUTH: {
    SIGNUP_REQUEST: "Received request to register user",
    LOGIN_REQUEST: "Received request to login user",
    LOGOUT_REQUEST: "Received request to logout user",
    REFRESH_TOKEN_REQUEST: "Received request to refresh auth token",

    USER_NOT_FOUND: "Authentication failed: user not found",
    INVALID_PASSWORD: "Authentication failed: invalid password",
    EMAIL_ALREADY_EXISTS: "Signup failed: email already exists",
    INVALID_TOKEN: "Invalid authentication token",
    TOKEN_EXPIRED: "Authentication token expired",

    SIGNUP_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "User logged in successfully",
    LOGOUT_SUCCESS: "User logged out successfully",
    TOKEN_REFRESH_SUCCESS: "Authentication token refreshed successfully",

    SIGNUP_FAILURE: "Error during user registration",
    LOGIN_FAILURE: "Error during user login",
    LOGOUT_FAILURE: "Error during user logout",
    TOKEN_REFRESH_FAILURE: "Error refreshing authentication token",
  },
};
