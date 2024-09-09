import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Protected({ children, authentication }) {
  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && !loginStatus) {
      navigate("/login", { replace: true });
    }
  }, [loginStatus]);
  return <>{children}</>;
}

export default Protected;
