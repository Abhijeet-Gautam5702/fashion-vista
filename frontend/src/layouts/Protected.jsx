import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";

function Protected({ children, authentication }) {
  // local state
  const [loading, setLoading] = useState(true);

  const storeAuth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && storeAuth.loginStatus !== authentication) {
      navigate("/", { replace: true });
    }
    setLoading(false);
  }, [storeAuth]);

  if (loading) {
    return (
      <div className="flex-grow w-full flex flex-row justify-center items-center">
        <Loader />
      </div>
    );
  }
  return <>{children}</>;
}

export default Protected;
