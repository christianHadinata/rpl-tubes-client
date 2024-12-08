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
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Params = {
  roleDosen: string;
  idSidang: string;
};

type DataSidangTypes = {
  idSidang: number;
  judulSkripsi: string;
  namaMahasiswa: string;
  npm: string;
  namaPembimbingUtama: string;
  namaPembimbingPendamping: string;
  namaKetuaTimPenguji: number;
  namaAnggotaTimPenguji: string;
  ta: string;
  tahunAjaran: string;
  tanggal: string;
  jamMulai: string;
  tempat: string;
};

type ButtonConfig = {
  icon: string;
  label: string;
  link?: string;
};

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  console.log(roleDosen);
  const idSidangInt = parseInt(idSidang);

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/sidang/singleSidang",
        {
          params: {
            idSidang: idSidangInt,
          },
        }
      );
      setDataSidang(data);
    };

    fetchData();
  }, []);

  const getButtonConfigs = (role: string): ButtonConfig[] => {
    const commonIcons = {
      jadwal: "/icon-jadwal.png",
      nilai: "/icon-nilai.png",
      informasi: "/icon-informasi.png",
      persetujuan: "/icon-persetujuan.png",
      catatanSidang: "/icon-catatan.png",
    };

    const buttonConfigMap: { [key: string]: ButtonConfig[] } = {
      Koordinator: [
        { icon: commonIcons.jadwal, label: "JADWAL DAN TEMPAT SIDANG" },
        {
          icon: commonIcons.nilai,
          label: "NILAI",
          link: `/nilai-koordinator/${idSidangInt}`,
        },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
      "Pembimbing Utama": [
        {
          icon: commonIcons.catatanSidang,
          label: "MEMBUAT CATATAN SIDANG",
          link: `/catatan-sidang/${roleDosen}/${idSidangInt}`,
        },
        { icon: commonIcons.nilai, label: "NILAI" },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
      "Pembimbing Pendamping": [
        {
          icon: commonIcons.catatanSidang,
          label: "MEMBUAT CATATAN SIDANG",
          link: `/catatan-sidang/${roleDosen}/${idSidangInt}`,
        },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
      "Ketua Tim Penguji": [
        { icon: commonIcons.nilai, label: "NILAI" },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
      "Anggota Tim Penguji": [
        { icon: commonIcons.nilai, label: "NILAI" },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
      Mahasiswa: [
        {
          icon: commonIcons.catatanSidang,
          label: "MELIHAT CATATAN SIDANG",
          link: `/catatan-sidang/${roleDosen}/${idSidangInt}`,
        },
        { icon: commonIcons.informasi, label: "INFORMASI SIDANG SKRIPSI" },
        { icon: commonIcons.persetujuan, label: "PERSETUJUAN BAP" },
      ],
    };

    return buttonConfigMap[role] || [];
  };

  const buttons = getButtonConfigs(roleDosen);

  return (
    <div className="bg-blue-100 h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-center text-5xl font-semibold text-blue-500 mb-20 max-w-full">
          {dataSidang?.judulSkripsi}
        </h1>
        <div className="grid grid-cols-2 gap-16 mb-8 place-items-center w-fit">
          {buttons.map((button, index) => (
            <Button
              key={index}
              as={Link}
              className={`
                bg-violet-500 text-white w-32 h-32 rounded-lg 
                flex flex-col items-center justify-center 
                break-words text-center whitespace-normal overflow-visible
                ${buttons.length === 3 && index === 0 ? "col-span-2" : ""}
              `}
              href={`${button.link}`}
            >
              <img
                src={button.icon}
                alt={button.label}
                width="50"
                height="50"
              />
              {button.label}
            </Button>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            as={Link}
            href={"/"}
            className="bg-violet-500 text-white px-8 py-2  mt-5"
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
}
