"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

const page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");
    if (isFirstRender) {
      // Refresh the page
      window.location.reload();

      // Remove the flag to prevent future refreshes
      localStorage.removeItem("firstRender");
    }
  }, []);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login-as-uploader");
    } else {
      try {
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
        }
        if (decodedToken && decodedToken.username && decodedToken.userId) {
          // Redirect to the URL format with query params if not already there
          const queryParams = new URLSearchParams(window.location.search);

          // Check if the query parameters already exist in the URL
          if (!queryParams.has("username") || !queryParams.has("Id")) {
            router.push(
              `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // In case of an invalid token, redirect to login
        router.push("/login-as-uploader");
      }
    }
  }, [router]);

    // Check if the token has expired
    useEffect(() => {
      if (expiryTime > 0) {
        const currentTime = Date.now() / 1000;
  
        if (expiryTime < currentTime) {
          // If token is expired, redirect to login
          localStorage.removeItem("token");
          router.push('/login-as-uploader');
        }
      }
    }, [expiryTime, router]);


  return (
    <>
    <h1>Hello there, Welcome to personal uploader page</h1>
    </>
  );
};

export default page;
