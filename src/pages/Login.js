import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "@reach/router";
// eslint-disable-next-line no-unused-vars
import styled from "styled-components/macro";

import Button from "../components/Button";
import Input from "../components/Input";
import PageWrapper from "../components/PageWrapper";
import StatusMsg from "../components/StatusMsg";

const AUTHENTICATE_USER = gql`
  mutation AuthenticateUser($input: AuthenticateUserInput!) {
    authenticateUser(input: $input) {
      user {
        id
        name
        token
      }
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const handleAuthentication = ({ authenticateUser }) => {
    window.localStorage.setItem("user-token", authenticateUser.user.token);
    navigate("/products");
  };

  const handleError = (error) => {
    setErrorMsg(error.message);
  };

  const [loginUser, { loading }] = useMutation(AUTHENTICATE_USER, {
    onCompleted: handleAuthentication,
    onError: handleError,
  });

  const login = () => {
    setErrorMsg(null);
    loginUser({ variables: { input: { email, password } } });
  };

  return (
    <PageWrapper>
      {loading && <StatusMsg>Authenticating User...</StatusMsg>}
      {errorMsg && <StatusMsg>{`${errorMsg}, please try again.`}</StatusMsg>}
      <div
        css={`
          width: 400px;
          padding: 30px;
          border-radius: 10px;
          background-color: #ff5060;
          box-shadow: 5px 10px 10px rgba(2, 128, 144, 0.4);
          text-align: center;
        `}
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={login}>LOG IN</Button>
      </div>
    </PageWrapper>
  );
};

export default Login;
