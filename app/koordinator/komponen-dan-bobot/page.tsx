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

type DataAwalTypes = {
  role: string;
  jumlahkomponen: number;
  persentase: number;
};

type DataKomponenDanBobotTypes = {
  idx: number;
  role: string;
  jumlahkomponen: number;
  persentase: number;
};

export default function page() {
  const [dataKomponenDanBobot, setDataKomponenDanBobot] =
    useState<DataKomponenDanBobotTypes[]>();

  const [selectedRole, setSelectedRole] = useState("");
  const [jumlahKomponen, setJumlahKomponen] = useState(0);
  const [persentaseNilai, setPersentaseNilai] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<DataAwalTypes[]>(
        "http://localhost:5000/api/koordinator/komponen-bobot"
      );

      const dataWithIndex = data.map((item, index) => ({
        ...item,
        idx: index + 1,
      }));
      console.log(dataWithIndex);
      setDataKomponenDanBobot(dataWithIndex);
    };

    fetchData();
  }, []);

  const columns = [
    {
      key: "no",
      label: "No",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "banyakKomponen",
      label: "Banyak Komponen",
    },
    {
      key: "bobot",
      label: "Bobot (%)",
    },
  ];

  const roleList = [
    {
      key: "Koordinator",
      label: "Koordinator",
    },
    {
      key: "Pembimbing Utama",
      label: "Pembimbing Utama",
    },
    {
      key: "Ketua Tim Penguji",
      label: "Ketua Tim Penguji",
    },
    {
      key: "Anggota Tim Penguji",
      label: "Anggota Tim Penguji",
    },
  ];

  return (
    <div className="bg-blue-50 w-screen h-screen overflow-x-hidden">
      <h1 className="text-6xl font-bold text-blue-400 text-center py-10">
        Komponen Dan Bobot Penilaian
      </h1>
      <div className="flex flex-col items-center">
        <Table
          aria-label="Example table with dynamic content"
          classNames={{
            wrapper: "p-0",
          }}
          className="w-2/5 "
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
            items={dataKomponenDanBobot || []}
            emptyContent={"Data Sidang Skripsi Masih Kosong"}
          >
            {(item) => {
              return (
                <TableRow key={item.idx} className="h-10">
                  <TableCell className="text-center font-medium w-18">
                    {item.idx}
                  </TableCell>
                  <TableCell className="text-center font-medium max-w-40 break-words">
                    {item.role}
                  </TableCell>
                  <TableCell className="text-center font-medium max-w-32 break-words">
                    {item.jumlahkomponen === 0 ? "-" : item.jumlahkomponen}
                  </TableCell>
                  <TableCell className="text-center font-medium max-w-10">
                    {item.persentase ? item.persentase : "-"}
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>

      <form action="" method="post" className="flex flex-col items-center pt-5">
        <div className="flex flex-col w-1/4">
          <label htmlFor="role">Role</label>
          <Select
            label="Pilih Role"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roleList.map((role) => (
              <SelectItem key={role.key}>{role.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col w-1/4 pt-3">
          <label htmlFor="komponenPenilaian">Komponen Penilaian</label>
          <Input
            label="Jumlah Komponen Penilaian"
            type="number"
            onChange={(e) => setJumlahKomponen(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col w-1/4 pt-3">
          <label htmlFor="persentasePenilaian">Persentase Penilaian (%)</label>
          <Input
            label="Persentase Nilai"
            type="number"
            onChange={(e) => setPersentaseNilai(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-10 w-1/2 py-5">
          <Button
            as={Link}
            href={"/"}
            className="bg-violet-500 w-1/2 text-white center justify-self-center"
          >
            KEMBALI
          </Button>
          <Button
            as={Link}
            href={`/koordinator/komponen-dan-bobot/${selectedRole}/${jumlahKomponen}/${persentaseNilai}`}
            className="bg-violet-500 w-1/2 text-white center justify-self-center"
            isDisabled={
              selectedRole != null &&
              jumlahKomponen != 0 &&
              persentaseNilai != 0
                ? false
                : true
            }
          >
            Lanjut
          </Button>
        </div>
      </form>
    </div>
  );
}
