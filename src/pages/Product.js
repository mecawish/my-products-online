import React, { useRef } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

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

const GENERATE_S3_PRESIGNED_URL = gql`
  mutation GenerateS3PresignedUrl($input: GenerateS3PresignedUrlInput!) {
    generateS3PresignedUrl(input: $input) {
      s3PresignedUrls {
        nodes {
          url
          formData
        }
      }
    }
  }
`;

const CREATE_SHARED_ASSET = gql`
  mutation CreateSharedAsset($input: CreateSharedAssetInput!) {
    createSharedAsset(input: $input) {
      jid
    }
  }
`;

const Product = ({ productId }) => {
  const hiddenFileInput = useRef(null);

  const uploadImage = ({ generateS3PresignedUrl }) => {
    const body = new FormData();
    const { url, formData } = generateS3PresignedUrl.s3PresignedUrls.nodes[0];

    Object.keys(formData).forEach((key) => {
      body.append(key, formData[key]);
    });

    body.append("file", hiddenFileInput.current.files[0]);

    fetch(url, {
      method: "POST",
      body: body,
    })
      .then((response) => response.text())
      .then((str) => {
        const xmlDoc = new window.DOMParser().parseFromString(str, "text/xml");
        const fileUrl = xmlDoc.getElementsByTagName("Location")[0].childNodes[0]
          .nodeValue;

        createSharedAsset({
          variables: {
            input: {
              fileUrl,
              kind: "IMAGE",
            },
          },
        });
      });
  };

  const handleCreatedAsset = ({ createSharedAsset }) => {
    console.log(createSharedAsset);
  };

  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { id: productId },
  });

  const [generatePresignedUrl] = useMutation(GENERATE_S3_PRESIGNED_URL, {
    onCompleted: uploadImage,
  });

  const [createSharedAsset] = useMutation(CREATE_SHARED_ASSET, {
    onCompleted: handleCreatedAsset,
  });

  if (loading) {
    return <StatusMsg>Loading...</StatusMsg>;
  }

  if (error) {
    return <StatusMsg>Error fetching product info</StatusMsg>;
  }

  const onFileUpload = (e) => {
    generatePresignedUrl({
      variables: {
        input: { metadata: { contentType: e.target.files[0].type, md5: "" } },
      },
    });
  };

  return (
    <PageWrapper>
      <ProductCard
        product={data.node}
        onFileUpload={onFileUpload}
        inputRef={hiddenFileInput}
      />
    </PageWrapper>
  );
};

export default Product;
