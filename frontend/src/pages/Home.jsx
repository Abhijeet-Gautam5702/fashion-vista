import React, { useEffect, useState } from "react";
import { Banner, HomeCollections, Policy, Subscription } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { storePopulateInventory } from "../store/inventorySlice/inventorySlice.js";
import { databaseService } from "../service";

function Home() {
  const [latestArrivals, setLatestArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  const inventory = useSelector((state) => state.inventory.inventory);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch data from the database and populate the inventory store
    (async () => {
      const productsFromDB = await databaseService.getAllProducts();
      dispatch(storePopulateInventory({ inventory: productsFromDB.data }));
    })();
  }, []);

  useEffect(() => {
    setLatestArrivals((prev) => {
      const newList = inventory.filter((item) => item.latestArrival);
      return newList;
    });

    setBestsellers((prev) => {
      const newList = inventory.filter((item) => item.bestSeller);
      return newList;
    });
  }, [inventory]);

  return (
    <div className="w-full flex flex-col justify-start items-center gap-24">
      <Banner />
      <HomeCollections
        headline={"LATEST COLLECTIONS"}
        subheadline={
          "lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor"
        }
        data={latestArrivals}
      />
      <HomeCollections
        headline={"BEST SELLERS"}
        subheadline={
          "lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor"
        }
        data={bestsellers}
      />
      <Policy />
      <Subscription />
    </div>
  );
}

export default Home;
