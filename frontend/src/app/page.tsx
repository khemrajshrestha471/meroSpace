"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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

  return (
    <>
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-start gap-4">
          {data.map((item) => (
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
    </>
  );
}
