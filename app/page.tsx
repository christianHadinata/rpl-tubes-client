"use client";

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

type DataSidangTypes = {
  idx: number;
  idSidang: number;
  judulSkripsi: string;
  TA: number;
  tahunAjaran: string;
  namaMahasiswa: string;
  npm: string;
  emailDosen: string | null;
  roleDosen: string | null;
};

type RoleListTypes = {
  key: string;
  label: string;
};

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dataSidang, setDataSidang] = useState<DataSidangTypes[] | undefined>();
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [tempSearchMessage, setTempSearchMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [filteredData, setFilteredData] = useState<
    DataSidangTypes[] | undefined
  >([]);

  const [roleList, setRoleList] = useState<RoleListTypes[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    const fetchData = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/sidang/listSidang",
        {
          params: {
            email: user?.email,
            role: user?.role,
          },
        }
      );

      setDataSidang(data);

      const dataWithIndex = dataSidang?.map((item, index) => ({
        ...item,
        idx: index + 1,
      }));

      setFilteredData(dataWithIndex);
    };

    if (user) {
      fetchData();
      const updatedRoleList =
        user.role === "Koordinator"
          ? [
              { key: "Koordinator", label: "Koordinator" },
              { key: "Pembimbing Utama", label: "Pembimbing Utama" },
              { key: "Pembimbing Pendamping", label: "Pembimbing Pendamping" },
              { key: "Ketua Tim Penguji", label: "Ketua Tim Penguji" },
              { key: "Anggota Tim Penguji", label: "Anggota Tim Penguji" },
            ]
          : [
              { key: "Pembimbing Utama", label: "Pembimbing Utama" },
              { key: "Pembimbing Pendamping", label: "Pembimbing Pendamping" },
              { key: "Ketua Tim Penguji", label: "Ketua Tim Penguji" },
              { key: "Anggota Tim Penguji", label: "Anggota Tim Penguji" },
            ];

      setRoleList(updatedRoleList);
    }
    console.log(user);
  }, [loading, user, router]);

  useEffect(() => {
    if (dataSidang) {
      let updatedData = dataSidang;

      if (selectedTahunAjaran) {
        updatedData = updatedData.filter(
          (item) => item.tahunAjaran === selectedTahunAjaran
        );
      }

      if (selectedRole) {
        updatedData = updatedData.filter(
          (item) => item.roleDosen === selectedRole
        );
      }

      if (searchMessage) {
        updatedData = updatedData.filter((e) =>
          selectedKategori
            ? e[selectedKategori as keyof DataSidangTypes]
                ?.toString()
                .toLowerCase()
                .includes(searchMessage.toLowerCase())
            : Object.values(e).some(
                (attr) =>
                  typeof attr === "string" &&
                  attr.toLowerCase().includes(searchMessage.toLowerCase())
              )
        );
      }

      const dataWithIndex = updatedData.map((item, index) => ({
        ...item,
        idx: index + 1,
      }));

      setFilteredData(dataWithIndex);
    }
  }, [
    dataSidang,
    selectedTahunAjaran,
    selectedRole,
    searchMessage,
    selectedKategori,
  ]);

  // const searchHandler = (value: string) => {
  //   if (
  //     selectedKategori === "namaMahasiswa" ||
  //     selectedKategori === "judulSkripsi" ||
  //     selectedKategori === "npm"
  //   ) {
  //     setFilteredData(() =>
  //       filteredData?.filter((e: DataSidangTypes) =>
  //         e[selectedKategori].toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //   } else {
  //     setFilteredData(() =>
  //       filteredData?.filter((e) =>
  //         Object.values(e).some(
  //           (attr) =>
  //             typeof attr === "string" &&
  //             attr.toLowerCase().includes(value.toLowerCase())
  //         )
  //       )
  //     );
  //   }
  // };

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

  const tahunAjaran = [
    {
      key: "GANJIL 2023/2024",
      label: "GANJIL 2023/2024",
    },
    {
      key: "GENAP 2023/2024",
      label: "GENAP 2023/2024",
    },
    {
      key: "GANJIL 2024/2025",
      label: "GANJIL 2024/2025",
    },
  ];

  const kategoriList = [
    {
      key: "judulSkripsi",
      label: "Judul",
    },
    {
      key: "namaMahasiswa",
      label: "Nama",
    },
    {
      key: "npm",
      label: "NPM",
    },
  ];

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
      </div>
    );
  }

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
              <Select
                label="Tahun Ajaran"
                className="w-1/5 rounded-l-lg"
                onChange={(e) => {
                  setSelectedTahunAjaran(e.target.value);
                }}
              >
                {tahunAjaran.map((tahun) => (
                  <SelectItem key={tahun.key}>{tahun.label}</SelectItem>
                ))}
              </Select>
              {/* tahun ajaran */}

              {/* Search*/}
              <Select
                label="Filter"
                className="w-[10%] rounded-l-lg ml-16"
                radius="none"
                classNames={{
                  trigger:
                    "rounded-l-lg bg-violet-500 hover:!bg-violet-400 text-white",
                  label: "text-white",
                }}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                {kategoriList.map((kategori) => (
                  <SelectItem key={kategori.key}>{kategori.label}</SelectItem>
                ))}
              </Select>
              <Input
                isClearable
                type="text"
                label="Cari"
                radius="none"
                placeholder="Cari berdasarkan Filter"
                className="w-1/3"
                onChange={(e) => setTempSearchMessage(e.target.value)}
              />
              <Button
                className="h-auto rounded-none rounded-r-lg bg-violet-500"
                onClick={() => setSearchMessage(tempSearchMessage)}
              >
                <img
                  src="/icon-search-putih.png"
                  alt="Search"
                  className="w-10 h-10"
                />
              </Button>
              {/* Search*/}

              {/* Role */}
              {user?.role !== "Mahasiswa" && (
                <Select
                  label="Role"
                  className="w-1/5 rounded-l-lg ml-16"
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                  }}
                >
                  {roleList.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              )}
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
                  items={filteredData || []}
                  emptyContent={"Data Sidang Skripsi Masih Kosong"}
                >
                  {(item) => {
                    console.log(item);
                    return (
                      <TableRow key={item.idx} className="">
                        <TableCell className="text-center font-medium max-w-10">
                          {item.idx}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-40 break-words">
                          {item.judulSkripsi}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-32 break-words">
                          {item.namaMahasiswa}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-10">
                          {item.npm}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-10">
                          {item.TA}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-10">
                          <Button
                            as={Link}
                            href={`/navigation/${
                              item.roleDosen || "Mahasiswa"
                            }/${item.idSidang}`}
                            variant="bordered"
                            isDisabled={item.TA === 1 ? true : false}
                            className={`${
                              item.TA === 1
                                ? "cursor-not-allowed opacity-50 pointer-events-auto"
                                : "cursor-pointer"
                            }`}
                          >
                            <img
                              src="/icon-detail.png"
                              alt=""
                              className="w-10 h-10"
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }}

                  {/* <TableRow key={1} className="">
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
                  </TableRow> */}
                </TableBody>
              </Table>

              {/* Hanya tersedia bagi koordinator */}
              {user?.role === "Koordinator" ? (
                <div className="pt-8 w-full flex justify-evenly items-center">
                  <Button
                    as={Link}
                    href={"/koordinator/komponen-dan-bobot"}
                    className="bg-violet-500 text-white  text-lg w-40 h-24 break-words text-center whitespace-normal overflow-visible"
                    size="md"
                  >
                    <p className="break-words">Komponen dan Bobot Penilaian</p>
                  </Button>

                  <Button
                    as={Link}
                    href={"/koordinator/tambah-data-sidang"}
                    className="bg-violet-500 text-white  text-lg w-40 h-24 break-words text-center whitespace-normal overflow-visible"
                    size="md"
                  >
                    Tambah Data Sidang
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
