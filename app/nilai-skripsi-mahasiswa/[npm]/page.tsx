"use client";

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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatDate, formatTime } from "@/app/utils/FormatDateAndTime";
import Swal from "sweetalert2";
import Image from "next/image";

type Params = {
  npm: string;
};

type DataNilaiMahasiswaTypes = {
  idx: number;
  judulSkripsi: string;
  npm: string;
  ta: number;
  totalPersentase: number;
  totalNilaiAkhir: number;
};

export default function page({ params }: { params: Params }) {
  const { npm } = params;
  const npmInt = parseInt(npm);
  const [dataNilaiMahasiswa, setDataNilaiMahasiswa] = useState<
    DataNilaiMahasiswaTypes[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<DataNilaiMahasiswaTypes[]>(
        "http://localhost:5000/api/mahasiswa/allNilai",
        {
          params: {
            npm: npmInt,
          },
        }
      );

      const filteredData = data?.filter((item) => (item.totalPersentase = 100));

      const dataWithIndex = filteredData?.map((item, index) => ({
        ...item,
        idx: index + 1,
      }));

      setDataNilaiMahasiswa(dataWithIndex);
    };

    fetchData();
  }, []);

  const columns = [
    {
      key: "No",
      label: "No",
    },
    {
      key: "JudulSkripsi",
      label: "Judul Skripsi",
    },
    {
      key: "NPM Mahasiswa",
      label: "NPM Mahasiswa",
    },
    {
      key: "TA",
      label: "TA",
    },
    {
      key: "Nilai Akhir",
      label: "Nilai Akhir",
    },
  ];
  return (
    <>
      <div className="h-screen w-full bg-blue-50">
        <div className="flex w-full items-center pt-4 text-center">
          <h1 className="text-blue-500 font-semibold text-6xl w-full">
            Nilai Skripsi
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center pt-14">
          <div className="w-2/3 max-h-screen ">
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
                  items={dataNilaiMahasiswa || []}
                  emptyContent={"Data Sidang Skripsi Masih Kosong"}
                >
                  {(item) => {
                    return (
                      <TableRow key={item.idx} className="">
                        <TableCell className="text-center font-medium max-w-10">
                          {item.idx}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-40 break-words">
                          {item.judulSkripsi}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-32 break-words">
                          {item.npm}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-10">
                          {item.ta}
                        </TableCell>
                        <TableCell className="text-center font-medium max-w-10">
                          {item.totalNilaiAkhir}
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </TableBody>
              </Table>
              <div className="text-center w-full flex justify-center pt-12">
                <Button
                  as={Link}
                  href={`/`}
                  name="returnBtn"
                  className="bg-violet-500 text-white"
                >
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
