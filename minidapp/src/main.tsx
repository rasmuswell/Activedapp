import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AppProvider from "./AppContext.tsx";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Record } from "./Pages/Record.tsx";
import { Monitor } from "./Pages/Monitor.tsx";
import { Review } from "./Pages/Review.tsx";
import { NotFound } from "./Pages/NotFound.tsx";
import { Timestamp } from "./Pages/Timestamp.tsx";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Record />} path={"/"} />
      <Route path="/monitor" element={<Monitor />} />
      <Route path="/review" element={<Review />} />
      <Route path="/timestamp" element={<Timestamp />} />
      <Route path="/*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
