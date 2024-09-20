import React from "react";

function CartTotal({ amount }) {
  return (
      <div className="w-full flex flex-col justify-start items-center gap-3">
        {/* Title */}
        <p className="w-full font-main font-500 text-text-col-2 text-size-20 sm:text-size-24">
          CART TOTALS
        </p>

        {/* Amounts */}
        <div className="w-full flex flex-col justify-start items-center gap-1 font-main font-400 text-black text-size-14">
          {/* Subtotal */}
          <div className="w-full py-1 flex flex-row justify-between items-center">
            <p className="w-full text-left">Subtotal</p>
            <p className="w-full text-right">$ {amount} </p>
          </div>
          {/* Shipping Fee */}
          <div className="w-full py-1 border-y-[1.5px] border-y-gray flex flex-row justify-between items-center">
            <p className="w-full text-left">Shipping Fee</p>
            <p className="w-full text-right">$ 10 </p>
          </div>
          {/* Total */}
          <div className="w-full py-1 flex flex-row justify-between items-center font-600 text-black">
            <p className="w-full text-left">Total</p>
            <p className="w-full text-right">$ {amount+10} </p>
          </div>
        </div>
      </div>
    
  );
}

export default CartTotal;
