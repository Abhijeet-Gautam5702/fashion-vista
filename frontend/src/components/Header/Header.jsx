import React, { useEffect, useState } from "react";
import { Icon, Loader, Logo } from "../../components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { search, person, bag } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { authService } from "../../service";
import { storeLogout } from "../../store/authSlice/authSlice";
import { storeClearCart } from "../../store/cartSlice/cartSlice";

function Header() {
  // local state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [navItems, setNavItems] = useState([
    {
      title: "HOME",
      path: "/",
    },
    {
      title: "COLLECTIONS",
      path: "/collections",
    },
    {
      title: "ABOUT",
      path: "/about",
    },
    {
      title: "CONTACT",
      path: "/contact-us",
    },
  ]);
  const [cartItemsBadge, setCartItemsBadge] = useState(0);

  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const storeCart = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Whenever store-cart changes, update the badge with number of items in the cart
  useEffect(() => {
    setCartItemsBadge((prev) => storeCart.cart.length);
  }, [storeCart]);

  const logoutHandler = async () => {
    try {
      const response = await authService.logout();
      // console.log(response)
      if (response) {
        // clear cart from store
        dispatch(storeClearCart());

        // logout from store
        dispatch(storeLogout());

        // navigate to homepage
        navigate("/login");

        // send toast
        toast("USER LOGOUT SUCCESSFUL", {
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
      /*
        AXIOS ERROR HANDLING
        The error sent by the backend server is stored inside the `AxiosError.response.data` object.

        NOTE: We have sent the exact same error object (sent by the backend service) to the client (handled in the authService.js file). Therefore, we can simply access the error in the same format as it was sent by the backend.
      */
      console.log(`User Logout Failed | Error = ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="relative flex-grow-0 w-full flex flex-col md:flex-row justify-between items-center py-4">
      {/* Logo */}
      <Link to="/">
        <Logo
          className={
            "border-b-[1.5px] border-gray sm:border-none text-size-20 lg:text-size-30 text-black-2 "
          }
        />
      </Link>
      {/* Nav items */}
      <div className=" mt-5 sm:mt-0 w-full sm:w-fit flex flex-row justify-evenly md:justify-center items-center gap-5 text-text-col-2 font-500 font-main text-size-12 lg:text-size-14">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) => {
                return `${
                  isActive ? "border-b-2 border-b-black-2" : ""
                } transition-all duration-150`;
              }}
            >
              <div>{item.title}</div>
            </NavLink>
          );
        })}
        {/* Admin Panel Button */}
        <Link to="/admin">
          <div className="absolute top-4 left-0 sm:relative sm:top-0 text-size-12 px-3 py-1 sm:px-4 sm:py-2 rounded-full border-[1.5px] border-text-col-1">
            Admin
          </div>
        </Link>
      </div>
      {/* Action icons */}
      <div className="absolute top-4 right-0 md:relative md:top-0 md:right-0  flex flex-row justify-center items-center  gap-3 sm:gap-5">
        <div
          className="cursor-pointer relative"
          onClick={() => {
            if (loginStatus) {
              setShowProfileMenu((prev) => !prev);
              return;
            } else {
              // display a toast saying "Please login"
              toast(`PLEASE LOGIN TO CONTINUE`, {
                duration: 1500,
                position: "top-center",
                icon: "🔒",
                style: {
                  fontFamily: "Outfit",
                  fontWeight: "500",
                  fontSize: "14px",
                },
              });

              // navigate to login page
              navigate("/login");
            }
          }}
        >
          <Icon
            icon={person}
            size={`${window.innerWidth < 600 ? "25px" : "35px"}`}
          />
          <div
            className={`${
              showProfileMenu ? "opacity-100" : "opacity-0"
            } absolute -translate-x-6 top-10 rounded-md py-2 px-5 text-size-16 font-main text-text-col-2 bg-base transition-all duration-150 space-y-1`}
          >
            <Link to="/orders">
              <p>Orders</p>
            </Link>
            <p onClick={() => logoutHandler()}>Logout</p>
          </div>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => {
            if (!loginStatus) {
              // display a toast saying "Please login"
              toast(`PLEASE LOGIN TO CONTINUE`, {
                duration: 1500,
                position: "top-center",
                icon: "🔒",
                style: {
                  fontFamily: "Outfit",
                  fontWeight: "500",
                  fontSize: "14px",
                },
              });
              navigate("/login");
              return;
            }
            navigate("/cart");
          }}
        >
          <Icon
            icon={bag}
            size={`${window.innerWidth < 600 ? "21px" : "28px"}`}
          />
          {/* Badge */}
          {cartItemsBadge > 0 ? (
            <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-1 sm:-right-1 w-[15px] h-[15px] sm:w-[20px] sm:h-[20px] rounded-full bg-black text-white font-main font-500 text-[10px] text-center flex flex-row items-center justify-center">
              {" "}
              {cartItemsBadge}{" "}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Header;
