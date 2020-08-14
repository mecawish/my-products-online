import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "@reach/router";
import { Waypoint } from "react-waypoint";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

import ProductPreview from "../components/ProductPreview";
import PageWrapper from "../components/PageWrapper";
import StatusMsg from "../components/StatusMsg";

const GET_PRODUCTS = gql`
  query getProducts($cursor: String) {
    viewer {
      id
      customer {
        id
        allProducts(first: 12, after: $cursor) {
          nodes {
            id
            name
            previews(first: 1) {
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
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const Products = () => {
  const navigate = useNavigate();
  const { loading, error, data, fetchMore } = useQuery(GET_PRODUCTS);

  const fetchMoreProducts = () => {
    data.viewer.customer.allProducts.pageInfo.hasNextPage &&
      fetchMore({
        variables: {
          cursor: data.viewer.customer.allProducts.pageInfo.endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newProducts = fetchMoreResult.viewer.customer.allProducts.nodes;
          const pageInfo = fetchMoreResult.viewer.customer.allProducts.pageInfo;

          return {
            ...prevResult,
            viewer: {
              ...prevResult.viewer,
              customer: {
                ...prevResult.viewer.customer,
                allProducts: {
                  ...prevResult.viewer.customer.allProducts,
                  nodes: [
                    ...prevResult.viewer.customer.allProducts.nodes,
                    ...newProducts,
                  ],
                  pageInfo,
                },
              },
            },
          };
        },
      });
  };

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
        <Waypoint onEnter={fetchMoreProducts} />
      </div>
    </PageWrapper>
  );
};

export default Products;
