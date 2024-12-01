"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
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

type UserDetails = {
  email: string;
  nama: string;
  role: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const decoded = jwtDecode<UserDetails>(token);
        setUser(decoded);
        setLoading(false);
      } catch (error) {
        console.error("Invalid token:", error);
        setError("Failed to get information from token");
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="h-screen w-full items-center justify-center bg-blue-50 flex "
      >
        <svg
          aria-hidden="true"
          className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        {/* <span className="sr-only">Loading...</span> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className=" h-screen w-full items-center justify-center bg-blue-50 flex flex-col gap-y-7">
        <h1 className="text-red-500 text-4xl font-bold">{error}</h1>
        <p className="text-2xl">Please re-login</p>
        <Button color="primary" size="lg" as={Link} href="/login">
          Log in
        </Button>
      </div>
    );
  }

  type DataTypes = {
    idx: number;
    judulSkripsi: string;
    nama: string;
    npm: string;
    ta: number;
  };

  const data: DataTypes[] = [];

  const columns = [
    {
      key: "no",
      label: "NO",
    },
    {
      key: "judulSkripsi",
      label: "JUDUL SKRIPSI",
    },
    {
      key: "nama",
      label: "NAMA",
    },
    {
      key: "npm",
      label: "NPM",
    },
    {
      key: "ta",
      label: "TA",
    },
    {
      key: "view",
      label: "VIEW",
    },
  ];

  return (
    <>
      <div className="h-screen w-full bg-blue-50">
        <div className="flex w-full items-center pt-2 text-center">
          <h1 className="text-blue-500 font-semibold text-6xl w-full">
            Pilih Sidang Skripsi
          </h1>
          <Button
            className="ml-auto absolute right-10"
            color="danger"
            size="lg"
            as={Link}
            href="/login"
          >
            Log out
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center pt-14">
          <div className="w-2/3 max-h-screen ">
            <div className="flex w-full  ">
              {/* tahun ajaran */}
              <Select label="Tahun Ajaran" className="w-1/5 rounded-l-lg">
                {/* {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))} */}
                <SelectItem key={1}>{"blabla"}</SelectItem>
              </Select>
              {/* tahun ajaran */}

              {/* Search*/}
              <Select
                label="Sort:"
                className="w-1/12 rounded-l-lg ml-auto"
                radius="none"
                classNames={{
                  trigger:
                    "rounded-l-lg bg-violet-500 hover:!bg-violet-400 text-white",
                  label: "text-white",
                }}
              >
                {/* {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))} */}
                <SelectItem key={1} className="text-white">
                  {"blabla"}
                </SelectItem>
              </Select>
              <Input
                isClearable
                type="email"
                label="Email"
                radius="none"
                placeholder="username@student.unpar.ac.id"
                className="w-1/3"
              />
              <Button className="h-auto rounded-none rounded-r-lg bg-violet-500">
                <img
                  src="/icon-search-putih.png"
                  alt="Search"
                  className="w-10 h-10"
                />
              </Button>
              {/* Search*/}

              {/* Role */}
              <Select label="Role:" className="w-1/5 rounded-l-lg ml-auto">
                {/* {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))} */}
                <SelectItem key={1}>{"blabla"}</SelectItem>
              </Select>
              {/* Role */}
            </div>
            <div className="pt-8">
              <Table
                aria-label="Example table with dynamic content"
                classNames={{
                  base: "max-h-[360px]",
                  wrapper: "p-0",
                }}
              >
                <TableHeader columns={columns} className="p-0">
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      className="text-center font-semibold text-base text-black sticky top-0 bg-default-100 bg-opacity-100 z-10 mt-4"
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={data}
                  emptyContent={"Data Sidang Skripsi Masih Kosong"}
                >
                  {/* {(item) => (
                    <TableRow key={item.idx} className="">
                      <TableCell className="text-center font-medium">
                        {item.idx}
                      </TableCell>

                      <TableCell className="text-center font-medium">
                        aaa
                      </TableCell>
                    </TableRow>
                  )} */}

                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} className="">
                    <TableCell className="text-center font-medium max-w-10">
                      {1}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-40 break-words">
                      {
                        "Sistem Rekomendasi E-Commerce Menggunakan Collaborative Filtering"
                      }
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-32 break-words">
                      {"Christian Hadinata blabla blabla"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"6182201020"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      {"1"}
                    </TableCell>
                    <TableCell className="text-center font-medium max-w-10">
                      <Button as={Link} href={""} variant="bordered">
                        <img
                          src="/icon-detail.png"
                          alt=""
                          className="w-10 h-10"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Hanya tersedia bagi koordinator */}
              <div className="pt-8 w-full flex justify-evenly items-center">
                <Button
                  as={Link}
                  href={""}
                  className="bg-violet-500 text-white  text-lg w-40 h-24 break-words text-center whitespace-normal overflow-visible"
                  size="md"
                >
                  <p className="break-words">Komponen dan Bobot Penilaian</p>
                </Button>

                <Button
                  as={Link}
                  href={""}
                  className="bg-violet-500 text-white  text-lg w-40 h-24 break-words text-center whitespace-normal overflow-visible"
                  size="md"
                >
                  Tambah Data Sidang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
