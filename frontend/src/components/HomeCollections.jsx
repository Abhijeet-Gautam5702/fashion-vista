import React from "react";
import { ProductCard } from "../components";

function HomeCollections({ headline, subheadline, data }) {
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <h1 className="w-full text-center font-main font-500 text-size-30 text-text-col-2">
        {headline.toUpperCase()}
      </h1>
      <h2 className="w-full text-center font-main text-text-col-1 font-400 text-size-16">
        {subheadline}
      </h2>
      <div className="w-full py-3 flex flex-row flex-wrap mt-3">
        <ProductCard
        name={"Women zip-front relaxed fit jacket"}
        price={43}
        image={""}
        path={`/product/productId`}
        />
      </div>
    </div>
  );
}

export default HomeCollections;
