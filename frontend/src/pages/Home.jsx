import React from "react";
import { Banner, HomeCollections, Policy, Subscription } from "../components";

function Home() {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-24">
      <Banner />
      <HomeCollections
        headline={"LATEST COLLECTIONS"}
        subheadline={
          "lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor"
        }
      />
      <HomeCollections
        headline={"BEST SELLERS"}
        subheadline={
          "lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor lorem ipsum dolos sit amor"
        }
      />
      <Policy />
      <Subscription />
    </div>
  );
}

export default Home;
