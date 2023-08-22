import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthService } from "./services/auth/AuthService";
import Login from "./components/auth/Login";
import { DataService } from "./services/data/DataService";
import CreateSpace from "./components/spaces/CreateSpace";

function App() {
  const [username, setUsername] = useState<string | undefined>(undefined);

  const authService = new AuthService();
  const dataService = new DataService(authService);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar username={username} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <div>Hello World!</div>,
        },
        {
          path: "/login",
          element: <Login authService={authService} setUsernameCb={setUsername} />,
        },
        {
          path: "/profile",
          element: <div>Profile Page</div>,
        },
        {
          path: "/spaces",
          element: <div>Spaces Page</div>,
        },
        {
          path: "/create-space",
          element: <CreateSpace dataService={dataService} />,
        },
      ],
    },
  ]);

  return (
    <>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
