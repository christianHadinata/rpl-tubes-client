"use client";

import React from "react";
import { useAuth } from "@/app/utils/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import Link from "next/link";
import Swal from "sweetalert2";
import { getToken } from "@/app/utils/getToken";

export default function page() {
  const { setUser } = useAuth();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="h-screen w-screen bg-blue-50">
      <div className="flex w-full items-center pt-10 text-center">
        <h1 className="text-blue-500 font-semibold text-6xl w-full">
          Welcome Admin!
        </h1>
        <Button
          className="ml-auto absolute right-10"
          color="danger"
          size="lg"
          as={Link}
          href="/login"
          onClick={handleLogOut}
        >
          Log out
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center pt-40">
        <Button
          as={Link}
          className="bg-violet-500 text-white text-lg w-54 h-14"
          href={"/admin/register"}
        >
          Register Pengguna
        </Button>
      </div>
    </div>
  );
}
