import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ image, name, price, path }) {
  return (
    <Link to={path}>
      <div className="w-[220px] flex flex-col justify-start items-center">
        {/* Image */}
        <div className="w-[220px] h-fit border-[1px] border-black-1 mb-2">
          <img className="w-full h-[250px] object-cover object-center" src={image} alt="product-image" />
        </div>
        {/* Name */}
        <p className="w-full text-left font-main font-400 text-size-14 text-text-col-2 text-ellipsis">
          {name}
        </p>
        {/* Price */}
        <p className="w-full text-left font-main font-500 text-size-14 text-text-col-2">
          {`$${price}`}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
