import React, { useEffect, useState } from "react";
import { FilterCheckbox, ProductCard, Searchbar } from "../components";
import { useSelector } from "react-redux";

function Collections() {
  // Get the inventory from the store
  const inventory = useSelector((state) => state.inventory.inventory);

  // local state
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    men: true,
    women: true,
    kids: true,
    winter: true,
    summer: true,
    sports: true,
    topwear: true,
    bottomwear: true,
    ethnic: true,
  });

  const filterProducts = (selectedFilters) => {
    return inventory.filter((item) =>
      selectedFilters.some((tag) => item.tags.includes(tag))
    );
  };

  // On first page load => set the products from the inventory
  useEffect(() => {
    setProducts(inventory);
  }, [inventory]);

  // filter the products local state according to the selected-filters
  useEffect(() => {
    const selectedFilters = Object.entries(filters)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);

    setProducts(filterProducts(selectedFilters));
  }, [filters]);

  return (
    <>
      {/* Searchbar */}
      <Searchbar />
      <div className="flex-grow w-full h-full flex flex-row justify-between items-stretch gap-6 py-5">
        {/* Filters */}
        <div className=" font-main text-black w-1/5 flex flex-col justify-start items-start gap-4 py-2">
          <p className="w-full text-size-20 font-400">FILTERS</p>

          {/* Category Filters */}
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-4 py-3">
            <p className="w-full text-size-14 font-500">CATEGORIES</p>
            <FilterCheckbox
              label={"Men"}
              checked={filters.men}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  men: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Women"}
              checked={filters.women}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  women: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Kids"}
              checked={filters.kids}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  kids: e.target.checked,
                }));
              }}
            />
          </div>

          {/* Fashion Type Filter */}
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-4 py-3">
            <p className="w-full text-size-14 font-500">FASHION TYPES</p>
            <FilterCheckbox
              label={"Topwear"}
              checked={filters.topwear}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  topwear: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Bottomwear"}
              checked={filters.bottomwear}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  bottomwear: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Ethnic"}
              checked={filters.ethnic}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  ethnic: e.target.checked,
                }));
              }}
            />
          </div>

          {/* Collection Type Filter */}
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-4 py-3">
            <p className="w-full text-size-14 font-500">SPECIAL COLLECTIONS</p>
            <FilterCheckbox
              label={"Winter"}
              checked={filters.winter}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  winter: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Summer"}
              checked={filters.summer}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  summer: e.target.checked,
                }));
              }}
            />
            <FilterCheckbox
              label={"Sports"}
              checked={filters.sports}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  sports: e.target.checked,
                }));
              }}
            />
          </div>
        </div>
        {/* Collections Panel */}
        <div className=" w-4/5 flex flex-col justify-start items-start px-3 gap-4">
          <p className="font-main font-500 text-size-24 text-text-col-2">
            <span className="text-text-col-1">ALL</span> PRODUCTS
          </p>
          <div className="flex flex-row flex-wrap gap-6">
            {products.map((item) => (
              <ProductCard
                key={item._id}
                image={item.images[0]}
                name={item.name}
                path={`/product/${item._id}`}
                price={32.9}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Collections;
