import axios from "axios";

class AuthService {
  async login({ email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/create-login-session",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(`User Login Failed | Error = ${error.message}`);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/remove-login-session",
        {}
      );
      return response.data;
    } catch (error) {
      console.log(`User Logout Failed | Error = ${error.message}`);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = axios.get(
        "http://localhost:8000/api/v1/users/get-current-user",
        {}
      );
      return response.data;
    } catch (error) {
      console.log(
        `Could not fetch current user details | Error = ${error.message}`
      );
      throw error;
    }
  }

  async signup({ email, password }) {
    try {
      const response = axios.post(
        "http://localhost:8000/api/v1/users/create-account",
        { email, password },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        `Could not fetch current user details | Error = ${error.message}`
      );
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
