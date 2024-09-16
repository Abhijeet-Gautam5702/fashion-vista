import React, { useEffect, useState } from "react";
import { Loader } from "../components";

function AdminProtected({ authentication, children }) {
  const [loading, setLoading] = useState(false); // Change to true later

  useEffect(() => {}, []);

  if (loading) {
    return (
      <div className="flex-grow w-full flex flex-row justify-center items-center">
        <Loader />
      </div>
    );
  }
  return <>{children}</>;
}

export default AdminProtected;
