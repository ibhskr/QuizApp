import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QuizPrepare } from "./components/QuizPrepare.jsx";
import { Test } from "./components/TestPage.jsx";
import { CompletedPage } from "./components/CompletedPage.jsx";

import Homexx from "./Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/quiz-prepare",
    element: <QuizPrepare />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path:"/finished",
    element:<CompletedPage/>
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
   
    <RouterProvider router={router} />,
  </StrictMode>
);
