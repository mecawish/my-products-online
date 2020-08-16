import React, { useContext } from "react";
import { Router, Link } from "@reach/router";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

import { authContext } from "./authContext";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Button from "./components/Button";
import PageHeader from "./components/PageHeader";

function App() {
  const { auth, setAuth } = useContext(authContext);

  const logout = () => {
    setAuth({ userToken: null });
  };

  return (
    <>
      <PageHeader>
        <Link
          to="products"
          css={`
            color: white;
            text-decoration: none;
          `}
        >
          Sayduck Platform
        </Link>
        {auth.userToken && <Button onClick={logout}>LOG OUT</Button>}
      </PageHeader>
      <div className="App">
        <Router>
          <Login path="/" />
          <Products path="products" />
          <Product path="product/:productId" />
        </Router>
      </div>
    </>
  );
}

export default App;
