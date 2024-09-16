import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader,Container } from "./components";
import { Toaster } from "react-hot-toast";

function AdminApp() {
  return (
    <div className="flex flex-col justify-between items-center w-full">
      <Toaster />
      <div className="min-h-[80vh] flex-grow w-full flex flex-col justify-start items-center">
        <AdminHeader />
        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

export default AdminApp;
