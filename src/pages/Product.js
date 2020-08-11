import React from "react";
import { useQuery, gql } from "@apollo/client";

import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import StatusMsg from "../components/StatusMsg";

const GET_PRODUCT_INFO = gql`
  query getProductInfo($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        name
        subtitle
        createdAt
        description
        previews {
          nodes {
            id
            title
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
`;

const Product = ({ productId }) => {
  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { id: productId },
  });

  if (loading) {
    return <StatusMsg>Loading...</StatusMsg>;
  }

  if (error) {
    return <StatusMsg>Error fetching product info</StatusMsg>;
  }

  return (
    <PageWrapper>
      <ProductCard data={data.node} />
    </PageWrapper>
  );
};

export default Product;
