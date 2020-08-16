import React from "react";
import { Link } from "@reach/router";
import styled from "styled-components/macro";
import { format } from "date-fns";

import { ReactComponent as Spinner } from "../spinner.svg";
import Button from "../components/Button";

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
`;

const StyledLink = styled(Link)`
  display: flex;
  padding: 20px;
  border-bottom: 2px solid #efefef;
  color: #727272;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #ff6a7a;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Previews = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 512px;
  padding: 30px;
  border-right: 2px solid #efefef;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: center;
    width: 256px;
  }
`;

const ImageWrapper = styled.div`
  height: 240px;
  width: 240px;
  padding: 5px;
  border: 1px solid #efefef;
  border-radius: 5px;
  margin: 2px;
  text-align: center;
`;

const Image = styled.img`
  max-width: 230px;
  max-height: 230px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 256px;
  padding: 30px;
`;

const Title = styled.div`
  > h1 {
    margin: 0;
    color: #ff5060;
    text-transform: uppercase;
    font-size: 1.5em;
    font-weight: 500;
  }

  > p {
    margin: 0;
    color: #727272;
  }

  > div {
    margin: 0;
    color: #727272;
    font-weight: 500;
  }
`;

const ProductCard = ({
  product,
  previews,
  onFileUpload,
  inputRef,
  isUploading,
}) => {
  const { name, subtitle, createdAt, description } = product;
  const imageUrls = previews.nodes.map((node) => node.asset.styles[0].url);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <CardWrapper>
      <StyledLink to="/products">BACK TO ALL PRODUCTS</StyledLink>
      <ProductInfo>
        <Previews>
          {imageUrls.length === 0 && !isUploading ? (
            <ImageWrapper>NO AVAILABLE PREVIEW</ImageWrapper>
          ) : (
            imageUrls.map((url, i) => (
              <ImageWrapper key={i}>
                <Image src={url} alt={product.name}></Image>
              </ImageWrapper>
            ))
          )}
          {isUploading && <Spinner />}
        </Previews>
        <ProductDetails>
          <Title>
            <h1>{name}</h1>
            <p>{subtitle}</p>
            <div>
              {`Created: ${format(new Date(createdAt), "do MMMM yyyy")}`}
            </div>
          </Title>
          <p>{description}</p>
          <Button onClick={handleClick}>Add Image Preview</Button>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={onFileUpload}
            css={`
              display: none;
            `}
          />
        </ProductDetails>
      </ProductInfo>
    </CardWrapper>
  );
};

export default ProductCard;
