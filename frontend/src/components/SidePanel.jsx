import React from "react";
import { NavLink } from "react-router-dom";

function SidePanel() {
  const panelItems = [
    {
      title: "Inventory",
      path: "inventory",
    },
    {
      title: "Add Items",
      path: "add-items",
    },
    {
      title: "Orders",
      path: "orders",
    },
  ];
  return (
    <div className="w-full flex flex-col justify-start items-center gap-3 px-3 py-5">
      {panelItems.map((item) => (
        <NavLink
          key={item.title}
          to={`/admin/${item.path}`}
          className={({ isActive }) => {
            let className = "border-[1px] w-full text-center py-2 font-main font-400 text-size-15 transition-colors duration-100 ";
            className += isActive ? " border-accent text-accent font-500 bg-base " : " text-black ";
            return className;
          }}
        >
          {item.title}
        </NavLink>
      ))}
    </div>
  );
}

export default SidePanel;
