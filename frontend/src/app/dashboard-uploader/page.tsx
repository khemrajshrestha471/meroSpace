"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  price: number;
};

const page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [data, setData] = useState<UploaderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
          const u_id = queryParams.get("Id") || "";
          setIsUserId(u_id);
          // Check if the query parameters already exist in the URL
          if (!queryParams.has("username") || !queryParams.has("Id")) {
            router.push(
              `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }

        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `http://localhost:4000/get-all-data/${isUserId}`
            );
            const result = await response.json();
            setData(result);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Error decoding token:", error);
        // In case of an invalid token, redirect to login
        router.push("/login-as-uploader");
      }
    }
  }, [router, isUserId]);

  // Check if the token has expired
  useEffect(() => {
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;

      if (expiryTime < currentTime) {
        // If token is expired, redirect to login
        localStorage.removeItem("token");
        router.push("/login-as-uploader");
      }
    }
  }, [expiryTime, router]);

  const FormSchema = z.object({
    headline: z.string(),
    description: z.string(),
    price: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      headline: "",
      description: "",
      price: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let id = isUserId;
    // generate unique id for each individual items that have been uploaded
    let unique_id = Array(24)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("");
    let headline = data.headline;
    let description = data.description;
    let price = data.price;

    fetch("http://localhost:4000/uploader-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        unique_id,
        headline,
        description,
        price,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Something Went Wrong.");
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      })
      .then((data) => {
        if (data.token) {
          // Save the token in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("firstRender", "true");
          const decodedToken = decodeToken(data.token);
          router.push(
            `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
      })
      .catch((err) => {
        alert(err.message);
      });
    form.reset();
  }

  const handleClear = () => {
    form.reset();
  };

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Headline Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Description Here"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Price Here"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit">Upload</Button>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-start gap-4">
          {currentItems.map((item) => (
            <li
              key={item.unique_id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="h-[230px] flex flex-col">
                <CardHeader className="flex-grow">
                  <CardTitle className="truncate">{item.headline}</CardTitle>
                  <CardDescription className="truncate">
                    {item.description}
                  </CardDescription>
                  <CardDescription>{item.price}</CardDescription>
                </CardHeader>
                <CardFooter className="flex mt-auto">
                  <Button className="ml-auto">Explore</Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default anchor behavior
                    if (currentPage > 1) {
                      setCurrentPage((prev) => prev - 1);
                    }
                  }}
                  className="no-underline"
                />
              </PaginationItem>

              {/* Render pagination numbers */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                // Show ellipsis only when needed
                if (
                  (pageNumber > 2 &&
                    currentPage > 2 &&
                    currentPage < totalPages - 1 &&
                    pageNumber === currentPage - 1) ||
                  (pageNumber < totalPages - 1 &&
                    currentPage < totalPages - 1 &&
                    pageNumber === currentPage + 1)
                ) {
                  return null; // Skip rendering this page number
                }

                // Render the first two and last two pages with ellipsis in between
                if (
                  pageNumber === 1 ||
                  pageNumber === 2 ||
                  pageNumber === totalPages - 1 ||
                  pageNumber === totalPages
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                        className="no-underline"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Render ellipsis in the middle
                if (
                  pageNumber === currentPage - 1 ||
                  pageNumber === currentPage + 1
                ) {
                  return null; // Skip rendering the adjacent pages to avoid duplicates
                }

                if (
                  (currentPage > 3 && pageNumber === 3) ||
                  (currentPage < totalPages - 2 &&
                    pageNumber === totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis className="text-blue-600" />
                    </PaginationItem>
                  );
                }

                return null; // Skip rendering other pages
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default anchor behavior
                    if (currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1);
                    }
                  }}
                  className="no-underline"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
    </>
  );
};

export default page;
