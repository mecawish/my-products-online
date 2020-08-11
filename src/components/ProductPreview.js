import React from "react";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

const ProductPreview = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12);

        cursor: pointer;

        &:hover {
          box-shadow: 0 2px 5px 0 rgba(	255, 80, 96, 0.8),
          0 2px 10px 0 rgba(	255, 80, 96, 0.5);
        }
      `}
    >
      <div
        css={`
          position: absolute;
          bottom: 16px;
          left: 24px;
          color: #ff5060;
          font-weight: bold;
        `}
      >
        {product.name}
      </div>
      <img
        src={
          product.previews.nodes[0]
            ? product.previews.nodes[0].asset.styles[0].url
            : `https://via.placeholder.com/300.png?text=No+Available+Preview`
        }
        alt={product.name}
        width="300px"
      ></img>
    </div>
  );
};

export default ProductPreview;
