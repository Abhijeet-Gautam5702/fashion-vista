function Container({ children }) {
  return (
    <div className="flex-grow flex flex-col justify-center items-center w-full">
      {children}
    </div>
  );
}

export default Container;
