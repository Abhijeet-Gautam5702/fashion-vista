import React from "react";
import { Rings } from "react-loader-spinner";

function Loader({ flag }) {
  return (
    <div>
      <Rings
        visible={flag}
        height="80"
        width="80"
        color="#86B6C4"
        ariaLabel="rings-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
