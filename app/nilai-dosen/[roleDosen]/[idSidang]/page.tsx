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
import Swal from "sweetalert2";
import { getToken } from "@/app/utils/getToken";

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

type DataKomponenTypes = {
  idKomponen: number;
  namaKomponen: string;
  role: string;
  bobot: number;
  nilai: number;
};

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  console.log(roleDosen);
  const idSidangInt = parseInt(idSidang);

  const router = useRouter();

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();
  const [dataKomponen, setDataKomponen] = useState<DataKomponenTypes[]>();
  const [totalNilai, setTotalNilai] = useState<number>(0);

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

    const fetchDataKomponen = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/sidang/allKomponenRole",
        {
          params: {
            idSidang: idSidangInt,
            roleDosen,
          },
        }
      );

      if (data) {
        const initialTotal = data.reduce(
          (sum: number, komponen: DataKomponenTypes) => {
            const nilaiKomponen = komponen.nilai || 0;
            return sum + nilaiKomponen * komponen.bobot;
          },
          0
        );
        setTotalNilai(initialTotal);
      }

      setDataKomponen(data);
    };

    fetchData();
    fetchDataKomponen();

    fetchData();
  }, []);

  const handleNilaiChange = (id: number, value: string) => {
    if (dataKomponen) {
      const updatedKomponen = dataKomponen.map((komponen) =>
        komponen.idKomponen === id
          ? { ...komponen, nilai: parseFloat(value) || 0 }
          : komponen
      );

      // Recalculate total nilai
      const total = updatedKomponen.reduce((sum, komponen) => {
        const nilaiKomponen = komponen.nilai || 0;
        return sum + nilaiKomponen * komponen.bobot;
      }, 0);

      setDataKomponen(updatedKomponen);
      setTotalNilai(total);
    }
  };

  const handleSubmit = async () => {
    const isValidInput = dataKomponen?.every(
      (komponen) =>
        komponen.nilai !== undefined &&
        komponen.nilai > 0 &&
        komponen.nilai <= 100
    );

    if (!isValidInput) {
      Swal.fire({
        title: "Invalid Input",
        icon: "warning",
        text: "Pastikan Seluruh Nilai Diisi dengan Angka (1-100)",
      });
    } else {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/dosen/tambah-nilai",
          {
            idSidang: idSidangInt,
            roleDosen,
            arrKomponenDanNilai: dataKomponen,
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
        console.log(error);
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
            text: `Gagal Menyimpan Nilai, Silahkan Coba Lagi!`,
            icon: "error",
            confirmButtonText: "Confirm",
          });
        }
      }
    }
  };

  return (
    <div className="bg-blue-50 w-screen h-screen flex flex-col items-center">
      <h1 className="text-6xl font-bold text-blue-500 text-center mt-6 absolute">
        Nilai Skripsi
      </h1>
      <div className="flex flex-col h-screen w-screen items-center justify-center mt-20">
        <div className="bg-gray-200/70 w-11/12 max-w-6xl rounded-lg shadow-md ">
          <form action="" method="post" className="flex flex-col p-5">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Judul Skripsi</span>
                <span className="w-2/3">{dataSidang?.judulSkripsi}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Nama Mahasiswa</span>
                <span className="w-2/3">{dataSidang?.namaMahasiswa}</span>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4 mb-4">
                <span className="font-semibold w-1/3">NPM</span>
                <span className="w-2/3">{dataSidang?.npm}</span>
              </div>

              <div className="border-solid border-gray-300 flex flex-col">
                <div className="max-h-[50vh] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr>
                        <th className="py-2 px-4 w-1/3">Komponen</th>
                        <th className="py-2 px-4 text-center w-1/3">Nilai</th>
                        <th className="py-2 px-4 text-center w-1/3">Bobot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataKomponen?.map((komponen) => (
                        <tr key={komponen.idKomponen}>
                          <td className="py-2 px-4 w-1/3">
                            {komponen.namaKomponen}
                          </td>
                          <td className="py-2 px-4 text-center w-1/3">
                            <input
                              type="number"
                              value={komponen.nilai || ""}
                              onChange={(e) =>
                                handleNilaiChange(
                                  komponen.idKomponen,
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-2 px-4 text-center w-1/3">
                            {komponen.bobot * 100}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 bg-white z-10 border-t-2">
                      <tr>
                        <td className="py-2 px-4 font-semibold w-1/3">
                          Total Nilai
                        </td>
                        <td className="py-2 px-4 text-center w-1/3">
                          {totalNilai.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-center w-1/3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-evenly pt-6 w-full">
          <Button
            as={Link}
            href={`/navigation/${roleDosen}/${idSidangInt}`}
            className="bg-violet-500 text-white"
            size="lg"
          >
            KEMBALI
          </Button>
          <Button
            className="bg-violet-500 text-white"
            size="lg"
            onClick={handleSubmit}
          >
            SIMPAN
          </Button>
        </div>
      </div>
    </div>
  );
}