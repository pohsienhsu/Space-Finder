import { SyntheticEvent, useState } from "react"
import { AuthService } from "../services/AuthService"
import { Navigate } from "react-router-dom";

type LoginProps = {
    authService: AuthService,
    setUsernameCb: (username: string) => void,
}

const Login = ({authService, setUsernameCb}: LoginProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (username && password) {
            const loginResponse = await authService.login(username, password);
            const username2 = authService.getUsername();

            if (username2) {
                setUsernameCb(username2)
            }

            if (loginResponse) {
                setLoginSuccess(true);
            } else {
                setErrorMessage("invalid credentials");
            }
        } else {
            setErrorMessage("Username and password required");
        }
    }

    const renderLoginResult = () => {
        if (errorMessage) {
            return <label>{errorMessage}</label>
        }
    }

    return (
      <div role="main">
        {loginSuccess && <Navigate to="/profile" replace={true} />}
        <h2>Please login</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input type="submit" value="Login" />
        </form>
        <br />
        {renderLoginResult()}
      </div>
    );
}

export default Login;