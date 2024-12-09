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
import { formatDate, formatTime } from "@/app/utils/FormatDateAndTime";

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
  jamSelesai: string;
  tempat: string;
};

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  console.log(roleDosen);
  const idSidangInt = parseInt(idSidang);

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();
  const [tanggalFormated, setTanggalFormated] = useState("");
  const [jamMulaiFormated, setJamMulaiFormated] = useState("");
  const [jamSelesaiFormated, setJamSelesaiFormated] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<DataSidangTypes>(
        "http://localhost:5000/api/sidang/singleSidang",
        {
          params: {
            idSidang: idSidangInt,
          },
        }
      );
      setDataSidang(data);

      const formatTanggal = formatDate(data.tanggal);
      const formatJamMulai = formatTime(data.jamMulai);
      const formatJamSelesai = formatTime(data.jamSelesai);

      setTanggalFormated(formatTanggal);
      setJamMulaiFormated(formatJamMulai);
      setJamSelesaiFormated(formatJamSelesai);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-blue-50 w-screen h-screen flex flex-col items-center">
      <h1 className="text-6xl font-bold text-blue-400 text-center mt-6 absolute">
        Informasi Sidang
      </h1>
      <div className="flex flex-col h-screen w-screen items-center justify-center mt-20">
        <div className="bg-gray-200/70 w-11/12 max-w-6xl rounded-lg shadow-md ">
          <form action="" method="post" className="flex flex-col p-5 h-full">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Judul Skripsi</span>
                <span className="w-2/3">{dataSidang?.judulSkripsi || "-"}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Nama Mahasiswa</span>
                <span className="w-2/3">
                  {dataSidang?.namaMahasiswa || "-"}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">NPM</span>
                <span className="w-2/3">{dataSidang?.npm || "-"}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">
                  Dosen Pembimbing Utama
                </span>
                <span className="w-2/3">
                  {dataSidang?.namaPembimbingUtama || "-"}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">
                  Dosen Pembimbing Pendamping
                </span>
                <span className="w-2/3">
                  {dataSidang?.namaPembimbingPendamping || "-"}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Ketua Tim Penguji</span>
                <span className="w-2/3">
                  {dataSidang?.namaKetuaTimPenguji || "-"}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Anggota Tim Penguji</span>
                <span className="w-2/3">
                  {dataSidang?.namaAnggotaTimPenguji || "-"}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Jenis Skripsi</span>
                <span className="w-2/3">{dataSidang?.ta || "-"}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Tanggal Sidang</span>
                <span className="w-2/3">{tanggalFormated || "-"}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Jam Sidang</span>
                <span className="w-2/3">
                  {jamMulaiFormated} - {jamSelesaiFormated}
                </span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Ruangan Sidang</span>
                <span className="w-2/3">{dataSidang?.tempat || "-"}</span>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center pt-6 w-full">
          <Button
            as={Link}
            href={`/navigation/${roleDosen}/${idSidangInt}`}
            className="bg-violet-500 text-white"
            size="lg"
          >
            KEMBALI
          </Button>
        </div>
      </div>
    </div>
  );
}
