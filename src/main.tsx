import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Search from "./Search";
import RocketiumSearch from "./Rocketium";
import MediaLibrary from "./MediaLibrary";

const router = createBrowserRouter([
  {
    path: "/:folderId?",
    element: <App />,
    errorElement: <div>Oops, error occured while routing to App</div>,
  },
  {
    path: "/search",
    element: <Search />,
    errorElement: <div>Oops, error occured while routing to Search</div>,
  },
  {
    path: "rocketium",
    element: <RocketiumSearch />,
    errorElement: <div>Oops, error occured while routing to Rocketium</div>,
  },
  {
    path: "media",
    element: <MediaLibrary />,
    errorElement: <div>Oops, error occured while routing to Media</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: "light" }}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
