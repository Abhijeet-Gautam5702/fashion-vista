import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon, Loader, Logo } from "../../components";
import { trash_2 } from "../../assets";
import { databaseService } from "../../service";
import {
  storeDeleteItemFromInventory,
  storePopulateInventory,
  storeUpdateProductStockStatus,
} from "../../store/inventorySlice/inventorySlice";
import toast from "react-hot-toast";

function Inventory() {
  // local state
  const [loading, setLoading] = useState(true);
  const [localInventory, setLocalInventory] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storeAuth = useSelector((state) => state.auth);
  const storeInventory = useSelector((state) => state.inventory);

  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // On Page Load => fetch inventory data from database and populate the store
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await databaseService.getAllProducts();
        if (response) {
          // set the store
          dispatch(storePopulateInventory({ inventory: response.data }));
        }
      } catch (error) {
        console.log(`Could not fetch inventory | Error = ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Change the local inventory state whenever the store-inventory changes
  useEffect(() => {
    setLocalInventory(storeInventory.inventory);
    setLoading(false);
  }, [storeInventory]);

  const removeItemFromInventoryHandler = async (productId) => {
    try {
      const response = await databaseService.removeProductFromInventory(
        productId
      );
      if (response) {
        // modify the store inventory
        dispatch(storeDeleteItemFromInventory({ productId }));

        // Show toast
        toast(`PRODUCT DELETED SUCCESSFULLY`, {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });
      }
    } catch (error) {
      console.log(`Product deletion failed | Error = ${error.message}`);
      throw error;
    }
  };

  const updateProductStockStatusHandler = async (productId) => {
    try {
      const response =
        await databaseService.updateProductStockStatusInInventory(productId);
      if (response) {
        console.log(response.data);
        // modify the store
        dispatch(storeUpdateProductStockStatus({ productId }));
      }
    } catch (error) {
      console.log(
        `Product Stock status could not be updated | Error = ${error.message}`
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col justify-start items-center p-5 gap-3">
      <p className="w-full text-left font-main text-size-24 text-text-col-2">
        ALL PRODUCTS
      </p>
      <table className="w-full overflow-auto border-separate border-spacing-y-2 font-main text-size-14 font-300">
        <thead className="bg-gray font-400 text-size-16">
          <tr className="border-b">
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Delete</th>
          </tr>
        </thead>
        <tbody className="font-main font-400 text-center">
          {localInventory.map((item) => (
            <tr key={item._id} className="">
              <td className="py-2 flex flex-row items-center justify-center">
                <img
                  className="text-size-12 font-300 w-[40px] h-auto"
                  src={item.images[0]}
                  alt="Image"
                />
              </td>
              <td className="py-2 text-ellipsis max-w-[300px] min-w-fit">
                {item.name}
              </td>
              <td className="py-2">{item.category}</td>
              <td className="py-2">{`$ ${item.price}`}</td>
              <td className="py-2">
                <p
                  className="w-full cursor-pointer"
                  onClick={() => updateProductStockStatusHandler(item._id)}
                >{`${item.stock ? "✅" : "❌"}`}</p>
              </td>
              <td className="py-2">
                <Icon
                  icon={trash_2}
                  size="18px"
                  className={"cursor-pointer"}
                  onClick={() => removeItemFromInventoryHandler(item._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
