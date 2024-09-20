import React, { useEffect, useState } from "react";
import { Loader } from "../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function AdminProtected({ authentication, children }) {
  // local state
  const [loading, setLoading] = useState(true);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  const storeAuth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // On Page Load => Check the device-width
  useEffect(() => {
    window.addEventListener("resize", () => {
      setDeviceWidth(window.innerWidth);
    });

    return () =>
      window.removeEventListener("resize", () => {
        setDeviceWidth(window.innerWidth);
      });
  }, []);

  // Whenever the device-width is smaller than 1024px => Don't allow to access the admin panel
  useEffect(() => {
    if (deviceWidth < 1024) {
      toast("Use a bigger screen to access Admin Panel", {
        duration: 1500,
        position: "top-center",
        icon: "🔒",
        style: {
          width: "fit-content",
          fontFamily: "Outfit",
          fontWeight: "500",
          fontSize: "14px",
        },
      });

      alert("Kindly use a bigger screen to access the Admin Panel")
      
      navigate("/", { replace: true });
    }
  }, [deviceWidth]);

  useEffect(() => {
    if (deviceWidth >= 1024 && authentication && storeAuth.adminLoginStatus !== authentication) {
      navigate("/admin/", { replace: true });
      toast("LOGIN AS ADMINISTRATOR", {
        duration: 1500,
        position: "top-center",
        icon: "🔒",
        style: {
          fontFamily: "Outfit",
          fontWeight: "500",
          fontSize: "14px",
        },
      });
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

export default AdminProtected;
