import React, { useEffect, useState } from "react";
import { Banner, HomeCollections, Policy, Subscription } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { storePopulateInventory } from "../store/inventorySlice/inventorySlice.js";
import { databaseService } from "../service";
import { banner, banner_2, banner_3 } from "../assets/index.js";

function Home() {
  const [latestArrivals, setLatestArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  const inventory = useSelector((state) => state.inventory.inventory);

  const dispatch = useDispatch();

  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <Banner image={banner} />
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
