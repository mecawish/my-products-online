import React from "react";
import { Router } from "@reach/router";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

import Login from "./pages/Login";
import Product from "./pages/Product";
import Products from "./pages/Products";
import PageHeader from "./components/PageHeader";

function App() {
  return (
    <>
      <PageHeader>
        <div
          css={`
            color: white;
            text-decoration: none;
          `}
        >
          Sayduck Platform
        </div>
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
