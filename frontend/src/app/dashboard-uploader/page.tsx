"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
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
    } 
  }, [router]);


  return (
    <>
    <h1>Hello there, Welcome to personal uploader page</h1>
    </>
  );
};

export default page;
