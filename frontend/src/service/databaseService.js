import axios from "axios";

class DatabaseService {
  async getAllProducts() {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/products",{});
    //   console.log("Response = ",response)
      return response.data;
    } catch (error) {
      console.log(`Could not fetch all products | Error = ${error.message}`);
      throw error;
    }
  }

  async getCurrentProduct() {}

  async addProductToCart() {}

  async updateProductQtInCart() {}

  async removeProductFromCart() {}
}

const databaseService = new DatabaseService();

export default databaseService;
