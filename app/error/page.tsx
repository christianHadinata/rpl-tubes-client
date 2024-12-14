"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An unknown error occurred";

  return (
    <div className=" max-h-screen bg-blue-50 flex flex-col items-center ">
      <h1 className="text-7xl text-red-500 absolute pt-40">
        Unauthorized Error!
      </h1>
      <p className="text-2xl capitalize pt-60 absolute">{message}</p>
      <div className="h-screen flex flex-col justify-center items-center">
        <Link href={"/"} className="text-xl underline text-blue-500">
          Go Back To Home
        </Link>
      </div>
    </div>
  );
}
