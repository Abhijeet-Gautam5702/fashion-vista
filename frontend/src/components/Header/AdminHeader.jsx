import React from "react";
import { Logo } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { storeAdminLogout, storeLogout } from "../../store/authSlice/authSlice";
import toast from "react-hot-toast";

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storeAuth = useSelector((state) => state.auth);

  const adminLogoutHandler = async () => {
    try {
      const response = await authService.adminLogout();
      if (response) {
        // change the store for admin
        dispatch(storeAdminLogout());
        // navigate to admin login page
        navigate("/admin/", { replace: true });
        // show toast
        toast("ADMIN LOGGED OUT SUCCESSFULLY", {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });
      }
    } catch (error) {
      console.log(`Admin Logout Failed | Error = ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="px-3 border-y-[1.5px] border-y-gray flex-grow-0 w-full flex flex-row justify-between items-center py-4">
      <div className="w-fit flex flex-col justify-start leading-none">
        {/* Logo */}
        <Link to="/admin/inventory">
          <Logo className={"text-size-24 text-black-2"} />
        </Link>
        {/* Admin Panel Head Text */}
        <p className="w-full text-right font-main font-500  text-accent text-size-14">
          ADMIN PANEL
        </p>
      </div>
      {/* Logout Button */}
      {storeAuth.adminLoginStatus && (
        <button
          type="button"
          className="py-2 px-5 bg-white border-[1.5px] border-black text-black hover:bg-black hover:text-white transition-colors duration-150 cursor-pointer font-main text-size-12 font-500 rounded-full"
          onClick={adminLogoutHandler}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default AdminHeader;
