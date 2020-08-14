import React from "react";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

const ProductPreview = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      css={`
        position: relative;
        width: 300px;
        height: 300px;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12);
        text-align: center;
        cursor: pointer;

        &:hover {
          box-shadow: 0 2px 5px 0 rgba(255, 80, 96, 0.8),
            0 2px 10px 0 rgba(255, 80, 96, 0.5);
        }

        > img {
          max-width: 300px;
          max-height: 300px;
        }
      `}
    >
      <div
        css={`
          position: absolute;
          bottom: 16px;
          left: 0;
          width: 300px;
          box-sizing: border-box;
          padding: 4px 10px;
          margin: 0 10px;
          color: white;
          background-color: #ff5060;
          opacity: 0.8;
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
      ></img>
    </div>
  );
};

export default ProductPreview;
