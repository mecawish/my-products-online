import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "@reach/router";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

import ProductPreview from "../components/ProductPreview";
import PageWrapper from "../components/PageWrapper";
import StatusMsg from "../components/StatusMsg";

const GET_PRODUCTS = gql`
  query getProducts {
    viewer {
      customer {
        allProducts {
          nodes {
            id
            name
            previews {
              nodes {
                id
                asset {
                  styles {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Products = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) {
    return <StatusMsg>Loading...</StatusMsg>;
  }

  if (error) {
    return <StatusMsg>Error fetching products</StatusMsg>;
  }

  return (
    <PageWrapper
      css={`
        justify-content: flex-start;
      `}
    >
      <h1>My Products</h1>
      <div
        css={`
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        `}
      >
        {data.viewer.customer.allProducts.nodes.map((product) => (
          <ProductPreview
            key={product.id}
            product={product}
            onClick={() => navigate(`product/${product.id}`)}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Products;
