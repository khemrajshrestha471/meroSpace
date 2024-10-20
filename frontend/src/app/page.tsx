"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  price: number;
};

export default function Home() {
  const [data, setData] = useState<UploaderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const isFirstRenderLanding = localStorage.getItem("firstRenderLanding");
  
    if (!isFirstRenderLanding) {
      localStorage.setItem("firstRenderLanding", "true");
      window.location.reload();
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/get-all-data");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
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
      </div>
    </>
  );
}
