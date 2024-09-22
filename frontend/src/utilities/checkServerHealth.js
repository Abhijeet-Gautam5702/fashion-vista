import { healthCheckService } from "../service/index.js";

const checkServerHealth = async () => {
    try {
      const response = await healthCheckService.healthCheck();
      if (response.success) {
        console.log(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Server is down or inactive | Error = ${error.message}`);
    }
  };

  export default checkServerHealth;

