import React, { useRef, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

import client from "../client";
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
      }
    }
  }
`;

const GET_PRODUCT_PREVIEWS = gql`
  query getProductPreviews($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        previews {
          nodes {
            id
            asset {
              id
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

const CREATE_PREVIEW = gql`
  mutation CreatePreview($input: CreatePreviewInput!) {
    createPreview(input: $input) {
      node {
        id
        asset {
          id
          styles {
            url
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

const JOB_UPDATES = gql`
  subscription onJobUpdates($jid: ID!) {
    jobUpdates(jid: $jid) {
      jid
      node {
        ... on SharedAsset {
          id
          styles {
            url
          }
        }
      }
    }
  }
`;

const Product = ({ productId }) => {
  const [jid, setJid] = useState(null);
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
    setJid(createSharedAsset.jid);
  };

  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { id: productId },
  });

  const {
    loading: loadingPreviews,
    error: previewsError,
    data: previews,
  } = useQuery(GET_PRODUCT_PREVIEWS, {
    variables: { id: productId },
  });

  const [generatePresignedUrl] = useMutation(GENERATE_S3_PRESIGNED_URL, {
    onCompleted: uploadImage,
  });

  const [createSharedAsset] = useMutation(CREATE_SHARED_ASSET, {
    onCompleted: handleCreatedAsset,
  });

  const [createPreview] = useMutation(CREATE_PREVIEW, {
    update(
      cache,
      {
        data: {
          createPreview: { node },
        },
      }
    ) {
      const product = cache.readQuery({
        query: GET_PRODUCT_PREVIEWS,
        variables: { id: productId },
      });

      cache.writeQuery({
        query: GET_PRODUCT_PREVIEWS,
        variables: { id: productId },
        data: {
          ...product,
          node: {
            ...product.node,
            previews: {
              ...product.node.previews,
              nodes: [...product.node.previews.nodes, node],
            },
          },
        },
      });
    },
  });

  useEffect(() => {
    if (jid) {
      client.subscribe({ query: JOB_UPDATES, variables: { jid } }).subscribe({
        next(data) {
          createPreview({
            variables: {
              input: {
                previewableId: productId,
                assetId: data.data.jobUpdates.node.id,
              },
            },
          });
        },
      });
    }
  }, [createPreview, jid, productId]);

  const onFileUpload = (e) => {
    generatePresignedUrl({
      variables: {
        input: { metadata: { contentType: e.target.files[0].type, md5: "" } },
      },
    });
  };

  if (loading || loadingPreviews) {
    return <StatusMsg>Loading...</StatusMsg>;
  }

  if (error || previewsError) {
    return <StatusMsg>Error fetching product info</StatusMsg>;
  }

  return (
    <PageWrapper>
      <ProductCard
        product={data.node}
        previews={previews.node.previews}
        onFileUpload={onFileUpload}
        inputRef={hiddenFileInput}
      />
    </PageWrapper>
  );
};

export default Product;
