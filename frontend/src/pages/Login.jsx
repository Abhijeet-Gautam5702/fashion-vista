import React from "react";
import { Button, Input } from "../components";
import { Link } from "react-router-dom";

function Login() {
  // Implement React-hook-form
  return (
    <div className="min-w-[400px] flex flex-col justify-start items-center gap-4">
      <p className="w-full text-center font-logo text-black text-size-30">
        Login
      </p>
      <form className="w-full flex flex-col justify-start items-center gap-3">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <div className="w-full flex flex-row justify-between items-center font-main font-400 text-size-14">
          <p className="w-full text-left text-text-col-2">
            Do not have an account?{" "}
          </p>
          <Link
            className="w-full text-right text-text-col-2 font-600 hover:underline transition-all duration-100"
            to="/signup"
          >
            Create an account
          </Link>
        </div>
        <Button
          btnText="Login"
          type="submit"
          className="w-[120px] text-size-16 border-[2px] border-black p-2"
          onClick={() => {
            // Log the user in
          }}
        />
      </form>
    </div>
  );
}

export default Login;
