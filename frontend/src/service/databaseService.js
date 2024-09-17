import axios from "axios";

class DatabaseService {
  // PRODUCT RELATED DATABASE SERVICES
  async getAllProducts() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/products",
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  async getCurrentProduct(productId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/products/${productId}`,
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  // CART RELATED DATABASE SERVICES
  async addProductToCart(data) {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/products/add-to-cart?productId=${
          data.productId
        }&size=${data.size}&quantity=${data.quantity || 1}`,
        {},
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  async getUserCart() {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/cart/get-cart`,
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  async removeProductFromCart(productId, size) {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/products/remove-from-cart?productId=${productId}&size=${size}`,
        {},
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  async updateProductQtInCart(productId, size, quantity) {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/products/update-product-qt-in-cart?productId=${productId}&size=${size}&quantity=${quantity}`,
        {},
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  // ORDER RELATED DATABASE SERVICES
  async placeOrder(address, phone, email, orderValue) {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/orders/place-order`,
        {
          address,
          phone,
          email,
          orderValue,
        },
        { withCredentials: true }
        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      );
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

  async getOrderHistory() {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/orders", {
        withCredentials: true,

        /*
          NOTE: For Axios Requests, this setting must be set to true.
          `withCredentials:true` option enables the browser to send cookies and other credential-related stuff to the server (located in a different domain than the frontend-client)
        */
      });
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

  // ADMIN-PRODUCT RELATED DATABASE SERVICES
  async removeProductFromInventory(productId) {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/admin/delete-product-from-inventory?productId=${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async updateProductStockStatusInInventory(productId) {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/admin/update-product-stock-status?productId=${productId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async getAllOrders() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/admin/get-all-orders",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async updateOrderStatus(orderId, newOrderStatus) {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/admin/update-order-status?orderId=${orderId}&newOrderStatus=${newOrderStatus}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
