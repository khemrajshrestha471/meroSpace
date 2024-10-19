"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login-as-uploader");
    } else {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUsername(decodedToken.username);
      } else {
        router.push("/login-as-uploader");
      }
    }
  }, [router]);

    // Decode JWT token
    const decodeToken = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    };

  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout-as-uploader", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/login-as-uploader");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <>
      <div>Welcome {username || "Loading..."}</div>
      <Button onClick={handleLogOut}>Logout</Button>
    </>
  );
};

export default page;
