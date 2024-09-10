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
      /*
        AXIOS RESPONSE HANDLING
        The response sent by the backend server is stored inside the `AxiosResponse.data` object

        NOTE: We will send the exact same response object (sent by the backend service) to the client. Therefore, we return `response.data` instead of `response` simply.
      */
      return response.data;
    } catch (error) {
      /*
        AXIOS ERROR HANDLING
        The error sent by the backend server is stored inside the `AxiosError.response.data` object

        NOTE: We will send the exact same error object (sent by the backend service) to the client. Therefore, we throw `error.response.data` instead of `error` simply.
      */
      throw error.response.data;
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
      throw error.response.data;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/get-current-user",
        {}
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async signup({ fullname, email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/create-account",
        { name: fullname, email, password },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

const authService = new AuthService();

export default authService;
