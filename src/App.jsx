import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "./components/Layout/MainNavigation";
import HomePage from "./pages/HomePage";
import AddGamePage from "./pages/AddGamePage";
import AuthenticationPage, { action as authenticationAction } from "./pages/AuthenticationPage";
import { action as logoutAction } from "./pages/Logout";
import { tokenLoader, checkAuthLoader, getTokenDuration } from "./utils/auth-utils";

function RootLayout() {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token)
      return;

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();

    const timer = setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);

    return () => clearTimeout(timer);
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      { path: "authentication", element: <AuthenticationPage />, action: authenticationAction },
      { path: "add-game", element: <AddGamePage />, loader: checkAuthLoader },
      { path: "logout", action: logoutAction },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
