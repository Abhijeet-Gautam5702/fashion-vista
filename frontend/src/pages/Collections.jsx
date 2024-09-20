import React, { useEffect, useState } from "react";
import {
  FilterCheckbox,
  Input,
  ProductCard,
  Icon,
  Loader,
} from "../components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { search as searchIcon } from "../assets";

function Collections() {
  // Get the inventory from the store
  const inventory = useSelector((state) => state.inventory.inventory);

  // local state
  const [loading, setLoading] = useState(true);
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
    formals: true,
  });
  const [search, setSearch] = useState("");

  // function to filter products
  // Filter products which have at least one of each type of filters
  const filterProducts = (selectedFilters) => {
    const categoryTags = ["men", "women", "kids"].filter((item) =>
      selectedFilters.includes(item)
    );

    const fashionTypeTags = [
      "topwear",
      "bottomwear",
      "ethnic",
      "formals",
    ].filter((item) => selectedFilters.includes(item));

    const collectionTags = ["winter", "summer", "sports"].filter((item) =>
      selectedFilters.includes(item)
    );

    return inventory.filter((item) => {
      const hasCategoryTag = categoryTags.some((tag) =>
        item.tags.includes(tag)
      );
      const hasFashionTag = fashionTypeTags.some((tag) =>
        item.tags.includes(tag)
      );
      const hasCollectionTag = collectionTags.some((tag) =>
        item.tags.includes(tag)
      );
      if (hasCategoryTag && hasFashionTag && hasCollectionTag) {
        return selectedFilters.some((tag) => item.tags.includes(tag));
      }
    });
  };

  // function to extract the filter names/keys from the filters object
  const extractFilters = (filters) => {
    const selectedFilters = Object.entries(filters)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);

    return selectedFilters;
  };

  // On first page load => set the products from the inventory
  useEffect(() => {
    setProducts(inventory);
    setLoading(false);
  }, [inventory]);

  // filter the products local state according to the selected-filters
  useEffect(() => {
    setSearch(""); //Clear the search input

    const selectedFilters = extractFilters(filters);
    setProducts(filterProducts(selectedFilters));
  }, [filters]);

  // filter the products based on the searchbar input
  useEffect(() => {
    const selectedFilters = extractFilters(filters);

    setProducts((prev) => {
      // Note: We have to ensure that the other filters remain intact when we add additional search-filter above them.
      const productsListToSearchFrom = filterProducts(selectedFilters);
      const newList = productsListToSearchFrom.filter((item) => {
        const itemName = item.name.toLowerCase();
        const searchKeyword = search.toLowerCase();
        if (itemName.includes(searchKeyword)) {
          return item;
        }
      });
      return newList;
    });
  }, [search]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative border-y-[1.5px] border-y-gray pb-20 flex-grow w-full h-full flex flex-row justify-between items-stretch gap-4 sm:gap-7 pt-20 sm:py-7">
      {/* Side Panel */}
      <div className=" font-main text-black sm:w-1/3 flex flex-col justify-start items-start gap-4 sm:py-2">
        {/* Searchbar */}
        <div className="absolute top-4 w-full sm:relative sm:top-0">
          <Icon
            className="absolute left-2 top-3"
            size={`${window.innerWidth > 450 ? "25px" : "20px"}`}
            icon={searchIcon}
          />
          <input
            name="search"
            type="text"
            className=" px-2 py-2.5 sm:p-3 sm:pl-10 pl-10 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-14 sm:text-size-16 text-text-col-2  placeholder:text-text-col-1/70"
            placeholder="Search a product name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Other filters */}
        <>
          <p className="w-full text-size-20 font-400 mt-0 sm:mt-2">FILTERS</p>

          {/* Category Filters */}
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-3 sm:px-4 py-3">
            <p className="w-full text-size-12 sm:text-size-14 font-500">
              CATEGORIES
            </p>
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
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-3 sm:px-4 py-3">
            <p className="w-full text-size-12 sm:text-size-14 font-500">
              FASHION{" "}
            </p>
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
            <FilterCheckbox
              label={"Formals"}
              checked={filters.formals}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  formals: e.target.checked,
                }));
              }}
            />
          </div>

          {/* Collection Type Filter */}
          <div className="w-full space-y-1 border-[1px] border-text-col-1 px-3 sm:px-4 py-3">
            <p className="w-full text-size-12 sm:text-size-14 font-500">
              COLLECTIONS
            </p>
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
        </>
      </div>

      {/* Collections Panel */}
      <div className=" w-4/5 flex flex-col justify-start items-start sm:px-3 gap-4">
        <p className="w-full font-main font-500 text-size-20 md:text-size-30 text-text-col-2">
          ALL PRODUCTS
        </p>
        <div className="flex flex-row flex-wrap gap-6">
          {products.length ? (
            products.map((item) => (
              <ProductCard
                key={item._id}
                image={item.images[0]}
                name={item.name}
                path={`/product/${item._id}`}
                price={item.price}
              />
            ))
          ) : (
            <p className="font-main text-text-col-2 text-size-16 font-400">
              No products according to chosen filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collections;
