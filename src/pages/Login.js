import React, { useState, useContext, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { navigate } from "@reach/router";

import { authContext } from "../authContext";
import Button from "../components/Button";
import Input from "../components/Input";
import LoginForm from "../components/LoginForm";
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
  const logInButton = useRef(null);

  const {
    auth: { userToken },
    setAuth,
  } = useContext(authContext);

  const onKeyUp = (e) => {
    // log in on Enter
    if (e.keyCode === 13) {
      logInButton.current.click();
    }
  };

  const handleAuthentication = ({ authenticateUser }) => {
    setAuth({ userToken: authenticateUser.user.token });
    navigate("products");
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

    if (email === "") {
      setErrorMsg("Email is required");
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
    } else if (password === "") {
      setErrorMsg("Password is required");
    } else {
      loginUser({ variables: { input: { email, password } } });
    }
  };

  if (userToken) navigate("products");

  return (
    <PageWrapper>
      {loading && <StatusMsg>Authenticating User...</StatusMsg>}
      {errorMsg && <StatusMsg>{`${errorMsg}, please try again.`}</StatusMsg>}
      <LoginForm>
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
          onKeyUp={onKeyUp}
        />
        <Button onClick={login} ref={logInButton}>
          LOG IN
        </Button>
      </LoginForm>
    </PageWrapper>
  );
};

export default Login;
