import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, FilterCheckbox, Loader } from "../../components";
import { databaseService } from "../../service";
import toast from "react-hot-toast";

function AddItems() {
  // local state
  const [loading, setLoading] = useState(false);

  const collections = [
    {
      title: "Winter",
    },
    {
      title: "Summer",
    },
    {
      title: "Sports",
    },
  ];

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "men",
      fashionType: "topwear",
      winter: false,
      summer: false,
      sports: false,
      stock: true,
      latestArrival: true,
      bestSeller: false,
      image: [],
    },
  });

  const addNewItemHandler = async (data) => {
    setLoading(true);
    clearErrors(); //clear all form errors
    try {
      // Create a `product` object (to be sent to the database service method)
      const product = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        bestSeller: data.bestSeller,
        sizes: ["XS", "S", "M", "L", "XL"],
        latestArrival: data.latestArrival,
        stock: data.stock,
        fashionType: data.fashionType,
        collectionType: [
          data.sports ? "sports" : null,
          data.winter ? "winter" : null,
          data.summer ? "summer" : null,
        ].filter((item) => item),
        image: Array.from(data.image),
      };

      const response = await databaseService.addNewProductToInventory(product);
      if (response.success) {
        // Show Toast
        toast(`PRODUCT ADDED TO INVENTORY`, {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });

        reset(); // reset the form
      }
      else{
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`New Product Upload failed | Error = ${error.message}`);

      // set form error
      setError("root.serverError", {
        type: "manual",
        message: error.message.toString(),
      });

      // throw error;
    } finally {
      setLoading(false);
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
    <div className="w-full flex-grow flex flex-col justify-start items-start py-5 px-8 gap-5">
      <p className="w-full text-left font-main text-size-24 text-text-col-2">
        ADD A NEW ITEM
      </p>
      {/* Form */}
      <form
        onSubmit={handleSubmit(addNewItemHandler)}
        className="w-3/5 font-main font-400 text-text-col-2 space-y-8"
        encType="multipart/form-data"
      >
        {/* Product name */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <label htmlFor="name" className="text-size-17">
            Product name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            min={10}
            max={50}
            placeholder="Product name should be short and concise"
            className="p-3 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70"
            {...register("name", { required: true })}
          />
        </div>

        {/* Product description */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <label htmlFor="description" className="text-size-17">
            Product description
          </label>
          <textarea
            id="description"
            name="description"
            minLength={10}
            maxLength={200}
            placeholder="Enter the product description here..."
            className="p-3 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70"
            {...register("description", { required: true })}
          />
        </div>

        {/* Product Category, Fashion-Type and Price*/}
        <div className="w-full flex flex-row justify-start items-center gap-10 font-main font-400 text-text-col-2">
          {/* Product Category */}
          <div className="flex flex-row justify-start items-center gap-2">
            <label className="text-size-17" htmlFor="category">
              Product category
            </label>
            <select
              className="outline-none p-2.5 border border-black-1"
              name="category"
              id="category"
              {...register("category", { required: true })}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          {/* Product Fashion Type */}
          <div className="flex flex-row justify-start items-center gap-2">
            <label className="text-size-17" htmlFor="fashionType">
              Fashion type
            </label>
            <select
              className="outline-none p-2.5 border border-black-1"
              name="fashionType"
              id="fashionType"
              {...register("fashionType", { required: true })}
            >
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="formals">Formals</option>
              <option value="ethnic">Ethnic</option>
            </select>
          </div>
          {/* Product Price */}
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <label htmlFor="name" className="text-size-17">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              step={0.1}
              placeholder="$"
              className="p-3 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70"
              {...register("price", { required: true })}
            />
          </div>
        </div>

        {/* Product Collection Type(s) */}
        <div className="w-full space-y-2 font-main font-400">
          <p className="text-size-17">Product collection(s)</p>
          <div className="w-full flex flex-row flex-wrap justify-start items-center gap-10">
            {collections.map((item) => (
              <div
                key={item.title.toLowerCase()}
                className="flex flex-row justify-start items-center gap-3"
              >
                <input
                  type="checkbox"
                  className="appearance-none w-3.5 h-3.5 border-[1px] border-black-2 checked:border-none checked:bg-positive-accent checked:border-transparent focus:outline-none cursor-pointer"
                  id={item.title.toLowerCase()}
                  defaultChecked={false}
                  onChange={(e) => {}}
                  {...register(item.title.toLowerCase())}
                />
                <label className="text-size-15 font-main font-400" htmlFor="">
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Other details */}
        <div className="w-full space-y-2 font-main font-400 text-text-col-2">
          <div className="w-full flex flex-row flex-wrap justify-start items-center gap-10">
            {/* Add to bestseller */}
            <div className="flex flex-row justify-start items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border-[1px] border-black-2  checked:bg-accent-2 checked:border-accent checked:border-[1.5px] focus:outline-none  cursor-pointer"
                id={"latestArrival"}
                defaultChecked={false}
                onChange={(e) => {}}
                {...register("bestSeller")}
              />
              <label className="text-size-17 font-main font-400" htmlFor="">
                Add to Bestsellers
              </label>
            </div>
            {/* Add to Latest arrivals */}
            <div className="flex flex-row justify-start items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border-[1px] border-black-2  checked:bg-accent-2 checked:border-accent checked:border-[1.5px] focus:outline-none  cursor-pointer"
                id={"latestArrival"}
                defaultChecked={false}
                onChange={(e) => {}}
                {...register("latestArrival")}
              />
              <label className="text-size-17 font-main font-400" htmlFor="">
                Add to Latest Arrivals
              </label>
            </div>
            {/* Stock available */}
            <div className="flex flex-row justify-start items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border-[1px] border-black-2  checked:bg-accent-2 checked:border-accent checked:border-[1.5px] focus:outline-none  cursor-pointer"
                id={"latestArrival"}
                defaultChecked={false}
                onChange={(e) => {}}
                {...register("stock")}
              />
              <label className="text-size-17 font-main font-400" htmlFor="">
                Stock available
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <label htmlFor="images" className="text-size-17">
            Product Image
          </label>
          <input
            id="image"
            name="image"
            required
            type="file"
            multiple
            className="p-3 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-16 text-text-col-2"
            {...register("image", { required: true })}
          />
        </div>

        {/* Add Button */}
        <Button
          btnText="Add to Inventory"
          className="w-full p-4"
          type="submit"
        />
      </form>
    </div>
  );
}

export default AddItems;
