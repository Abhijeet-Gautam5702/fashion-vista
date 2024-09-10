import React from "react";
import { FilterCheckbox, ProductCard, Searchbar } from "../components";

function Collections() {
  return (
    <>
      {/* Searchbar */}
      <Searchbar />
      <div className="flex-grow w-full h-full flex flex-row justify-between items-stretch gap-6 py-5">
        {/* Filters */}
        <div className=" font-main text-black w-1/5 flex flex-col justify-start items-start gap-4 py-2">
          <p className="w-full text-size-20 font-400">FILTERS</p>
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-4 py-3">
            <p className="w-full text-size-14 font-500">CATEGORIES</p>
            <FilterCheckbox />
            <FilterCheckbox />
            <FilterCheckbox />
          </div>
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-4 py-3">
            <p className="w-full text-size-14 font-500">FASHION TYPES</p>
            <FilterCheckbox />
            <FilterCheckbox />
            <FilterCheckbox />
          </div>
        </div>
        {/* Collections Panel */}
        <div className=" w-4/5 flex flex-col justify-start items-start px-3 gap-4">
          <p className="font-main font-500 text-size-24 text-text-col-2">
            <span className="text-text-col-1">ALL</span> COLLECTIONS
          </p>
          <div className="flex flex-row flex-wrap gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 34, 5, 6, 7, 8].map(
              (item) => (
                <ProductCard
                  image={""}
                  name={"Test Product Name"}
                  path={"/product/productId"}
                  price={32.9}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Collections;
