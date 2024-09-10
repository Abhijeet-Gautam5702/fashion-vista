import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Protected({ children, authentication }) {
  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && !loginStatus) {
      navigate("/", { replace: true });
    }
  }, [loginStatus, authentication]);
  return <>{children}</>;
}

export default Protected;
