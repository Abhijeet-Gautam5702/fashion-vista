import React, { useEffect, useState } from "react";
import { Icon, Logo } from "../../components";
import { Link, NavLink } from "react-router-dom";
import { search, person, bag } from "../../assets";
import { useSelector } from "react-redux";

function Header() {
  const loginStatus = useSelector((state) => state.auth.loginStatus);
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

  useEffect(() => {
    // setShowProfileMenu(loginStatus);
  }, [loginStatus]);

  return (
    <div className="w-full flex flex-row justify-between items-center py-3">
      {/* Logo */}
      <Link to="/">
        <Logo />
      </Link>
      {/* Nav items */}
      <div className="flex flex-row justify-center items-center gap-5 text-text-col-2 font-500 font-main text-size-14">
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
          <div className="text-size-12 px-4 py-2 rounded-full border-[1.5px] border-text-col-1">
            Admin Panel
          </div>
        </Link>
      </div>
      {/* Action icons */}
      <div className="flex flex-row justify-center items-center gap-4">
        <div className="cursor-pointer" onClick={() => {}}>
          <Icon icon={search} size="27px" />
        </div>
        <div
          className="cursor-pointer relative"
          onClick={() => {
            if (!loginStatus) {
              setShowProfileMenu((prev) => !prev);
              return;
            }
            // display a toast saying "Please login"
          }}
        >
          <Icon icon={person} size="33px" />
          <div
            className={`${
              showProfileMenu ? "opacity-100" : "opacity-0"
            } absolute -translate-x-6 top-10 rounded-md py-2 px-5 text-size-16 font-main text-text-col-2 bg-base transition-all duration-150 space-y-1`}
          >
            <Link to="/orders">
              <p>Orders</p>
            </Link>
            <p onClick={() => {
              // log the user out from the database 
              // navigate to homepage
              // modify store accordingly (should happen automatically ideally!)
            }}>Logout</p>
          </div>
        </div>
        <Link to={"/cart"}>
          <Icon icon={bag} size="28px" />
        </Link>
      </div>
    </div>
  );
}

export default Header;
