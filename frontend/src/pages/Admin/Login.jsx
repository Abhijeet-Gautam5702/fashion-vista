import React, { useState } from "react";
import { Button, Input, Loader } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../../service";
import { useSelector, useDispatch } from "react-redux";
import { storeAdminLogin } from "../../store/authSlice/authSlice";
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
      const response = await authService.adminLogin({
        email: data.email,
        password: data.password,
      });
      
      if (response) {
        reset(); // reset the form

        if (!response.data.adminPermission) {
          toast(`INCORRECT ADMIN CREDENTIALS`, {
            duration: 1500,
            position: "top-center",
            icon: "❌",
            style: {
              fontFamily: "Outfit",
              fontWeight: "500",
              fontSize: "14px",
            },
          });
          return;
        }

        // set auth state to store
        dispatch(storeAdminLogin({ adminData: response.data }));
        console.log("store dispatched")

        // navigate to homepage
        navigate("/admin/inventory", { replace: true });

        // Show toast
        toast(`ADMIN LOGIN SUCCESSFUL`, {
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

      if (error.message === "INVALID PASSWORD") {
        setError("password", {
          type: "manual",
          message:
            "Please ensure that the password has at least one uppercase and one special character",
        });
      } else {
        // show error on the screen (set form errors)
        setError("root", {
          type: "manual",
          message: error.message.toString(),
        });
      }

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
    <div className="w-[400px] flex flex-col justify-start items-center gap-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          {errors.password && (
            <p
              className={`w-full text-center text-size-14 font-main font-500 text-danger transition-all duration-100`}
            >
              {errors.password.message}
            </p>
          )}
          <p className="w-full text-center font-logo text-black text-size-30">
            Admin Login
          </p>
          <form
            onSubmit={handleSubmit(loginHandler)}
            className="w-full flex flex-col justify-start items-center gap-3"
          >
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
            <Button
              btnText="Login as Admin"
              type="submit"
              className=" mt-3 w-full text-size-16 border-[2px] border-black p-2 py-3"
            />
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
