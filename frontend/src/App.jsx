import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header } from "./components";

function App() {
  // Fetch all the products data from the database and populate the store

  // A completely different JSX will be returned if "/admin" is visited
  return (
    <div className="px-32">
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
