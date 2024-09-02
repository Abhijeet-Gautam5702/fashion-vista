import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header } from "./components";

function App() {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export default App;
