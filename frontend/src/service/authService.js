import axios from "axios";

class AuthService {
  // USER RELATED AUTH SERVICES
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
          withCredentials: true,
          /*
            NOTE: For Axios Requests, this setting must be set to true.
            `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
          */
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
        {},
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
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
        { withCredentials: true }
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
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  // ADMIN RELATED AUTH SERVICES

  async adminLogin({ email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/create-admin-login-session",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
          /*
            NOTE: For Axios Requests, this setting must be set to true.
            `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
          */
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

  async adminLogout() {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/remove-admin-login-session",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getCurrentAdmin() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/admin/get-current-admin",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

const authService = new AuthService();

export default authService;
