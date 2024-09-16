import React from "react";
import { Logo } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../service";
import { useDispatch } from "react-redux";
import { storeAdminLogout, storeLogout } from "../../store/authSlice/authSlice";

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogoutHandler = async () => {
    try {
      const response = await authService.adminLogout();
      if (response) {
        // change the store for admin
        dispatch(storeAdminLogout());
        // navigate to admin login page
        navigate("/admin/", { replace: true });
      }
    } catch (error) {
      console.log(`Admin Logout Failed | Error = ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="px-3 border-y-[1.5px] border-y-gray flex-grow-0 w-full flex flex-row justify-between items-center py-4">
      {/* Logo */}
      <Link to="/admin/inventory">
        <Logo className={"text-size-30 text-black-2"} />
      </Link>
      {/* Logout Button */}
      <button
        type="button"
        className="py-2 px-5 bg-white border-[1.5px] border-black text-black hover:bg-black hover:text-white transition-colors duration-150 cursor-pointer font-main text-size-14 font-500"
        onClick={adminLogoutHandler}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminHeader;
