import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const [username, setUsername] = useState<string | undefined>(undefined);

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
          element: <div>Login Page</div>,
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
          element: <div>Create Space Page</div>,
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
