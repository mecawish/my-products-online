import React from "react";
import styled from "styled-components";

const PreviewWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
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
`;

const ProductName = styled.div`
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
`;

const ProductPreview = ({ product, onClick }) => {
  return (
    <PreviewWrapper onClick={onClick}>
      <ProductName>{product.name}</ProductName>
      {product.previews.nodes[0] ? (
        <img
          src={product.previews.nodes[0].asset.styles[0].url}
          alt={product.name}
        ></img>
      ) : (
        <div>NO AVAILABLE PREVIEW</div>
      )}
    </PreviewWrapper>
  );
};

export default ProductPreview;
