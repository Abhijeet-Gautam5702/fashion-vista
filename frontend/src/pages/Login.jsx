import React, { useState } from "react";
import { Button, Input, Loader } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../service";
import { useSelector, useDispatch } from "react-redux";
import { storeLogin } from "../store/authSlice/authSlice.js";
import toast from "react-hot-toast";

function Login() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setValue,
    setError,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginHandler = async (data) => {
    clearErrors(); // Clear all the form errors
    setLoading(true); // Set the loader to true

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      // console.log(response.data);
      if (response) {
        reset(); // reset the form

        // set auth state to store
        dispatch(storeLogin({ userData: response.data }));

        // navigate to homepage
        navigate("/", { replace: true });

        // Show toast
        toast(`USER LOGIN SUCCESSFUL`, {
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
      console.log(`Login Form Submission Failed || Error = ${error.message}`); // show error on browser console

      // show error on the screen (set form errors)
      setError("root.serverError", {
        type: "manual",
        message: error.message.toString(),
      });

      // Show toast
      toast(`${error.message}`, {
        duration: 1500,
        position: "top-center",
        icon: "❌",
        style: {
          fontFamily: "Outfit",
          fontWeight: "500",
          fontSize: "14px",
        },
      });
    } finally {
      setLoading(false); // set loading to false
    }
  };

  return (
    <div className="min-w-[400px] flex flex-col justify-start items-center gap-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="w-full text-center font-logo text-black text-size-30">
            Login
          </p>
          <form
            onSubmit={handleSubmit(loginHandler)}
            className="w-full flex flex-col justify-start items-center gap-3"
          >
            {errors.root && (
              <p className="text-size-16 font-main font-600 text-red">
                {errors.root.message}
              </p>
            )}
            <Input
              name="email"
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            <div className="w-full flex flex-row justify-between items-center font-main font-400 text-size-14">
              {" "}
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
            />
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
