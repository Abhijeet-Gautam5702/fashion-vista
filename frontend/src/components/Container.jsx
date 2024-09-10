import toast, { Toaster } from "react-hot-toast";

function Container({ children }) {
  return (
    <div className="flex-grow flex flex-col justify-center items-center w-full">
      <Toaster />
      {children}
    </div>
  );
}

export default Container;
