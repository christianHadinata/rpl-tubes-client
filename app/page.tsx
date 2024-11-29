"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function Home() {
  const [roleUser, setRoleUser] = useState<string>("");
  const [namaUser, setNamaUser] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: { email: string; nama: string; role: string } =
            jwtDecode(token);
          setRoleUser(decoded.role);
          setNamaUser(decoded.nama);
          setEmailUser(decoded.email);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    fetchToken();
  }, []);
  return (
    <>
      <div className="flex flex-col h-screen w-full items-center justify-center bg-blue-50 gap-y-10">
        <h1 className="text-6xl">Hello {namaUser}</h1>
        <h1 className="text-3xl">Email: {emailUser}</h1>
        <h1 className="text-3xl">Role: {roleUser}</h1>
      </div>
    </>
  );
}
