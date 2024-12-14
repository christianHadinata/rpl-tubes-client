"use client";

import React from "react";

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
  Card,
  CardHeader,
} from "@nextui-org/react";
import Link from "next/link";
import Swal from "sweetalert2";
import { getToken } from "@/app/utils/getToken";
import { EyeSlashFilledIcon } from "@/app/components/EyeSlashFilledIcon ";
import { EyeFilledIcon } from "@/app/components/EyeFilledIcon";

export default function page() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [npm, setNpm] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !nama || !password || !role) {
      Swal.fire({
        title: "Error!",
        text: "Semua Field Berbintang Wajib Diisi!",
        icon: "error",
        confirmButtonText: "Confirm",
      });
      return;
    }

    if (role === "Mahasiswa" && !npm) {
      Swal.fire({
        title: "Warning!",
        text: "Untuk Mahasiswa, NPM Wajib Diisi!",
        icon: "warning",
        confirmButtonText: "Confirm",
      });
      return;
    }

    if (role !== "Mahasiswa" && npm) {
      Swal.fire({
        title: "Warning!",
        text: "Selain Role Mahasiswa, NPM Tidak Perlu Diisi!",
        icon: "warning",
        confirmButtonText: "Confirm",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/register",
        {
          email,
          nama,
          password,
          role,
          npm,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log(data);

      if (data) {
        Swal.fire({
          title: "Success!",
          text: "Data Registrasi Berhasil Disimpan!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          location.reload();
        });
      }
    } catch (error: any) {
      if (error.response?.data?.message === "idSidang is required") {
        const errorMessage = "you are not allowed to access this resource";
        router.push(`../../error?message=${encodeURIComponent(errorMessage)}`);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Terjadi Kesalahan Sistem, Silahkan Coba Lagi!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      }
    }
  };

  const roles = [
    { value: "Koordinator", label: "Koordinator" },
    { value: "Dosen", label: "Dosen" },
    { value: "Mahasiswa", label: "Mahasiswa" },
  ];
  return (
    <div className="h-screen w-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center text-blue-500 text-5xl absolute top-10 font-semibold">
        Registrasi
      </div>
      <Card className="w-full max-w-md p-10 mt-10">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              isRequired
              isClearable
              type="email"
              placeholder="budi@unpar.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Nama"
              isRequired
              isClearable
              type="text"
              placeholder="Budi"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <Input
              isRequired
              label="Password"
              placeholder="Budi123"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              onChange={(e) => setPassword(e.target.value)}
              type={isVisible ? "text" : "password"}
            />
            <Select
              label="Pilih role pengguna"
              onChange={(e) => setRole(e.target.value)}
              isRequired
            >
              {roles.map((roleOption) => (
                <SelectItem key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="text"
              placeholder="NPM (Hanya untuk mahasiswa)"
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
            />

            <Button type="submit" className="w-full bg-violet-500 text-white">
              Daftar
            </Button>
          </form>
        </div>
      </Card>
      <Button
        as={Link}
        href={`/admin`}
        name="returnBtn"
        className="bg-violet-500 text-white mt-5"
      >
        Kembali
      </Button>
    </div>
  );
}
