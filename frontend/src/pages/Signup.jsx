import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Loader } from "../components";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { storeLogin } from "../store/authSlice/authSlice.js";
import { authService } from "../service";

function Signup() {
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
      name: "",
      email: "",
      password: "",
    },
  });

  const signupHandler = async (data) => {
    clearErrors(); // Clear all the form errors
    setLoading(true); // Set the loader to true

    try {
      const response = await authService.signup({
        fullname: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        reset(); // reset the form

        // set auth state to store
        dispatch(storeLogin({ userData: response.data }));

        // navigate to homepage
        navigate("/", { replace: true });

        // Show toast
        toast(`USER ACCOUNT CREATION SUCCESSFUL`, {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      /*
        AXIOS ERROR HANDLING
        The error sent by the backend server is stored inside the `AxiosError.response.data` object.

        NOTE: We have sent the exact same error object (sent by the backend service) to the client (handled in the authService.js file). Therefore, we can simply access the error in the same format as it was sent by the backend.
      */
      console.log(`Signup Form Submission Failed || Error = ${error.message}`); // show error on browser console

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
    <div className="w-full sm:w-[400px] flex flex-col justify-start items-center gap-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="w-full text-center font-logo text-black text-size-24 sm:text-size-30">
            Sign up
          </p>
          <form
            onSubmit={handleSubmit(signupHandler)}
            className="w-full flex flex-col justify-start items-center gap-3"
          >
            {errors.root && (
              <p className="text-size-16 font-main font-600 text-red">
                {errors.root.message}
              </p>
            )}
            <Input
              name="name"
              placeholder="Name"
              type="text"
              {...register("name", { required: true })}
            />
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
            <div className="w-full flex flex-row justify-between items-center font-main font-400 text-size-12 sm:text-size-14">
              {" "}
              <p className="w-full text-left text-text-col-2">
                Already have an account?{" "}
              </p>
              <Link
                className="w-full text-right text-text-col-2 font-600 hover:underline transition-all duration-100"
                to="/login"
              >
                Login
              </Link>
            </div>
            <Button
              btnText="Create account"
              type="submit"
              className="w-full sm:w-[120px] text-size-14 sm:text-size-16 border-[2px] border-black p-2"
            />
          </form>
        </>
      )}
    </div>
  );
}

export default Signup;
