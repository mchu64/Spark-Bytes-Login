"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { authState } = useAuth();
  const userId = authState?.decodedToken?.id;

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Protected Route example</h1>
      <p>Your current user ID is: {userId}</p>
    </div>
  );
};

export default ProtectedRoute;
