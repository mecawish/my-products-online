import React from "react";
import { Link } from "@reach/router";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";
import { format } from "date-fns";

import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slider,
  Slide,
} from "pure-react-carousel";

import "pure-react-carousel/dist/react-carousel.es.css";

import Button from "../components/Button";

const ProductCard = ({ product, onFileUpload, inputRef }) => {
  const { name, subtitle, createdAt, description, previews } = product;
  const imageUrls = previews.nodes.map((node) => node.asset.styles[0].url);

  const handleClick = (event) => {
    inputRef.current.click();
  };

  return (
    <div
      css={`
        width: 720px;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12);
      `}
    >
      <Link
        to="/products"
        css={`
          display: flex;
          padding: 20px;
          border-bottom: 2px solid #efefef;
          color: #727272;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            color: #ff6a7a;
          }
        `}
      >
        BACK TO ALL PRODUCTS
      </Link>
      <div
        css={`
          display: flex;
          flex-direction: row;

          > div {
            width: 50%;
          }
        `}
      >
        <div
          css={`
            padding: 30px;
            border-right: 2px solid #efefef;
          `}
        >
          {imageUrls.length === 0 ? (
            <img
              src="https://via.placeholder.com/300.png?text=No+Available+Preview"
              alt="no_available_preview"
            />
          ) : (
            <CarouselProvider
              naturalSlideWidth={300}
              naturalSlideHeight={300}
              totalSlides={imageUrls.length}
            >
              <Slider>
                {imageUrls.map((url, i) => (
                  <Slide index={i} key={i}>
                    <img src={url} alt="preview_image" width="300px" />
                  </Slide>
                ))}
              </Slider>
              <div
                css={`
                  text-align: center;

                  > button {
                    margin: 10px;
                  }
                `}
              >
                <Button as={ButtonBack}>Back</Button>
                <Button as={ButtonNext}>Next</Button>
              </div>
            </CarouselProvider>
          )}
        </div>
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: start;
            padding: 30px;
          `}
        >
          <div>
            <div
              css={`
                margin: 0;
                color: #ff5060;
                text-transform: uppercase;
                font-size: 1.5em;
                font-weight: 500;
              `}
            >
              {name}
            </div>
            <div
              css={`
                margin: 0;
                color: #727272;
              `}
            >
              {subtitle}
            </div>
          </div>

          <div
            css={`
              margin: 0;
              color: #727272;
              font-weight: 500;
            `}
          >
            {`Created: ${format(new Date(createdAt), "do MMMM yyyy")}`}
          </div>

          <p>{description}</p>
          <Button onClick={handleClick}>Add Image Preview</Button>
          <input
            type="file"
            ref={inputRef}
            onChange={onFileUpload}
            css={`
              display: none;
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
