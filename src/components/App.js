import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import ForgotPassword from "./ForgotPassword";
import Sounds from "./Sounds";
import UploadSound from "./UploadSound";
import Navbar from "./Navbar";
import FinishAccount from "./FinishAccount";
import Profile from "./Profile";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="update-profile"
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="finish-account"
                  element={
                    <PrivateRoute>
                      <FinishAccount />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="upload-sound"
                  element={
                    <PrivateRoute>
                      <UploadSound />
                    </PrivateRoute>
                  }
                />

                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="sounds" element={<Sounds />} />
                <Route path="profile/:username" element={<Profile />} />
              </Routes>
            </div>
          </Container>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
