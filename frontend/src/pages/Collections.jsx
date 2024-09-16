import React, { useEffect, useState } from "react";
import { FilterCheckbox, Input, ProductCard, Icon, Loader } from "../components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { search as searchIcon } from "../assets";

function Collections() {

  // Get the inventory from the store
  const inventory = useSelector((state) => state.inventory.inventory);

  // local state
  const [loading,setLoading]=useState(true)
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
  const [search, setSearch] = useState("");

  // function to filter products
  const filterProducts = (selectedFilters) => {
    return inventory.filter((item) =>
      selectedFilters.some((tag) => item.tags.includes(tag))
    );
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
    setSearch("");//Clear the search input

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

  if(loading){
    return (
      <div>
        <Loader/>
      </div>
    )
  }

  return (
      <div className="border-y-[1.5px] border-y-gray pb-20 flex-grow w-full h-full flex flex-row justify-between items-stretch gap-7 py-7">
        {/* Side Panel */}
        <div className=" font-main text-black w-1/3 flex flex-col justify-start items-start gap-4 py-2">
          {/* Searchbar */}
          <div className="w-full relative">
            <Icon
              className="absolute left-2 top-3"
              size={"25px"}
              icon={searchIcon}
            />
            <input
              name="search"
              type="text"
              label={<Icon size="30px" icon={searchIcon} />}
              className="p-3 pl-10 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70"
              placeholder="Search a product name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          {/* Other filters */}
          <>
            <p className="w-full text-size-20 font-400 mt-2">FILTERS</p>

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
              <p className="w-full text-size-14 font-500">
                SPECIAL COLLECTIONS
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
        <div className=" w-4/5 flex flex-col justify-start items-start px-3 gap-4">
          <p className="w-full font-main font-500 text-size-30 text-text-col-2">
            ALL PRODUCTS
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
  );
}

export default Collections;
