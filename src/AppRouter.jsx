// AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
// Import other components as needed

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add routes for other components */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
