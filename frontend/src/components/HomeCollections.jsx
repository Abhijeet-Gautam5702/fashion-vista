import React, { useEffect } from "react";
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
      <div className="w-full py-3 flex flex-row flex-wrap justify-around items-start gap-7 mt-3">
        {data.map((item, index) => {
          if (index < 4) {
            return (
              <ProductCard
                key={item._id}
                name={item.name}
                price={item.price}
                image={item.images[0]}
                path={`/product/${item._id}`}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default HomeCollections;
