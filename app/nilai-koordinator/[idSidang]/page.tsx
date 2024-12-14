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
} from "@nextui-org/react";
import Link from "next/link";
import Swal from "sweetalert2";
import { getToken } from "@/app/utils/getToken";

type Params = {
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
  const { idSidang } = params;
  const idSidangInt = parseInt(idSidang);

  const router = useRouter();

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();

  const [judulSkripsi, setJudulSkripsi] = useState("");
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [npmMahasiswa, setNpmMahasiswa] = useState("");
  const [nilai, setNilai] = useState(0);

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
      setJudulSkripsi(data.judulSkripsi);
      setNamaMahasiswa(data.namaMahasiswa);
      setNpmMahasiswa(data.npm);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!nilai) {
      Swal.fire({
        title: "Error!",
        text: "Nilai harus diisi!",
        icon: "error",
        confirmButtonText: "Confirm",
      });
    } else {
      if (nilai < 1 || nilai > 100) {
        Swal.fire({
          title: "Error!",
          text: "Nilai harus berada pada range (1-100)!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
        return;
      }
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/koordinator/tambah-nilai",
          {
            idSidang: idSidangInt,
            nilai,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            params: {
              idSidang: idSidangInt,
            },
          }
        );

        console.log(data);

        if (data) {
          Swal.fire({
            title: "Success!",
            text: "Nilai Mahasiswa Berhasil Disimpan!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {
            location.reload();
          });
        }
      } catch (error: any) {
        if (
          error.response?.data?.message ===
          "you are not allowed to access this resource"
        ) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred";
          router.push(
            `../../error?message=${encodeURIComponent(errorMessage)}`
          );
        } else {
          Swal.fire({
            title: "Error!",
            text: "Terjadi Kesalahan Sistem, Silahkan Coba Lagi!",
            icon: "error",
            confirmButtonText: "Confirm",
          });
        }
      }
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex flex-col justify-center">
      <h1 className="text-6xl font-bold text-center text-blue-400 mt-10">
        Nilai
      </h1>

      <div className="h-screen flex flex-col items-center justify-center mb-10">
        <main className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          <section>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-gray-700 font-semibold">
                <label>Judul Skripsi</label>
              </div>
              <div>
                <p>{judulSkripsi}</p>
              </div>

              <div className="text-gray-700 font-semibold">
                <label>Nama</label>
              </div>
              <div>
                <p>{namaMahasiswa}</p>
              </div>

              <div className="text-gray-700 font-semibold">
                <label>NPM</label>
              </div>
              <div>
                <p>{npmMahasiswa}</p>
              </div>

              <div className="text-gray-700 font-semibold">
                <label>Nilai Akhir</label>
              </div>
              <div>
                <form action="" className="flex items-center space-x-4">
                  <input
                    type="number"
                    name="inputNilai"
                    className="border border-gray-300 rounded-lg p-2 w-24"
                    placeholder="Nilai"
                    id="inputNilai"
                    onChange={(e) => setNilai(Number(e.target.value))}
                  />
                </form>
              </div>
            </div>

            <div className="text-center w-full flex justify-around">
              <Button
                as={Link}
                href={`/navigation/Koordinator/${idSidangInt}`}
                name="returnBtn"
                className="bg-violet-500 text-white"
              >
                Kembali
              </Button>

              <Button
                name="submitBtn"
                id="submitBtn"
                className="bg-violet-500 text-white"
                onClick={handleSubmit}
              >
                Simpan
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}