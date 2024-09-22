import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

class HealthCheckService {
  async healthCheck() {
    try {
      const response = await axios.get(
        `${backendURL}/api/v1/health/healthcheck`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

const healthCheckService=new HealthCheckService();

export default healthCheckService;
