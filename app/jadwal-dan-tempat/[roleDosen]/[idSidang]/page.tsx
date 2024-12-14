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

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  console.log(roleDosen);
  const idSidangInt = parseInt(idSidang);

  const router = useRouter();

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedBulan, setSelectedBulan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedJamMulai, setSelectedJamMulai] = useState("");
  const [selectedJamSelesai, setSelectedJamSelesai] = useState("");
  const [selectedRuangSidang, setSelectedRuangSidang] = useState("");

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

  const handleSubmit = async () => {
    if (
      !selectedTanggal ||
      !selectedBulan ||
      !selectedTahun ||
      !selectedJamMulai ||
      !selectedJamSelesai ||
      !selectedRuangSidang
    ) {
      Swal.fire({
        title: "Error!",
        text: "Semua Data Harus Diisi!",
        icon: "error",
        confirmButtonText: "Confirm",
      });
    } else {
      const tanggalFormatedYYYYMMDD =
        selectedTahun + "-" + selectedBulan + "-" + selectedTanggal;
      const jamMulaiFormatedTime = selectedJamMulai + ":00";
      const jamSelesaiFormatedTime = selectedJamSelesai + ":00";
      console.log(tanggalFormatedYYYYMMDD);
      console.log(jamMulaiFormatedTime);
      console.log(jamSelesaiFormatedTime);

      try {
        const { data } = await axios.patch(
          "http://localhost:5000/api/sidang/jadwalDanTempatSidang",
          {
            idSidang: idSidangInt,
            tanggal: tanggalFormatedYYYYMMDD,
            tempat: selectedRuangSidang,
            jamMulai: jamMulaiFormatedTime,
            jamSelesai: jamSelesaiFormatedTime,
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
            text: "Jadwal dan Tempat Sidang Berhasil Disimpan!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {
            router.push(`../../navigation/${roleDosen}/${idSidangInt}`);
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
            text: `Gagal Menyimpan Jadwal dan Tempat Sidang, Silakan Coba Lagi!`,
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
        Jadwal dan Tempat
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
                <div className="flex space-x-2 w-2/3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    defaultValue={"00"}
                    onChange={(e) => setSelectedTanggal(e.target.value)}
                  >
                    <option className="text-gray-500" value="00" disabled>
                      Tanggal
                    </option>
                    <option value="01">1</option>
                    <option value="02">2</option>
                    <option value="03">3</option>
                    <option value="04">4</option>
                    <option value="05">5</option>
                    <option value="06">6</option>
                    <option value="07">7</option>
                    <option value="08">8</option>
                    <option value="09">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    defaultValue={"00"}
                    onChange={(e) => setSelectedBulan(e.target.value)}
                  >
                    <option className="text-gray-500" value="00" disabled>
                      Bulan
                    </option>
                    <option value="01">Januari</option>
                    <option value="02">Februari</option>
                    <option value="03">Maret</option>
                    <option value="04">April</option>
                    <option value="05">Mei</option>
                    <option value="06">Juni</option>
                    <option value="07">Juli</option>
                    <option value="08">Agustus</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    defaultValue={"00"}
                    onChange={(e) => setSelectedTahun(e.target.value)}
                  >
                    <option className="text-gray-500" value="00" disabled>
                      Tahun
                    </option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                    <option value="2032">2032</option>
                    <option value="2033">2033</option>
                    <option value="2034">2034</option>
                    <option value="2035">2035</option>
                    <option value="2036">2036</option>
                    <option value="2037">2037</option>
                    <option value="2038">2038</option>
                    <option value="2039">2039</option>
                    <option value="2040">2040</option>
                  </select>
                </div>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Jam Sidang</span>
                <div className="flex space-x-2 w-2/3">
                  <input
                    type="time"
                    className="border border-gray-300 rounded px-2 py-1 w-1/4 text-center"
                    onChange={(e) => setSelectedJamMulai(e.target.value)}
                  />
                  <div className="flex justify-center items-center">
                    <span>s/d</span>
                  </div>
                  <input
                    type="time"
                    className="border border-gray-300 rounded px-2 py-1 w-1/4 text-center"
                    onChange={(e) => setSelectedJamSelesai(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-solid border-b-2 border-gray-300 h-11 flex items-center px-4">
                <span className="font-semibold w-1/3">Ruangan Sidang</span>
                <div className="flex space-x-2 w-2/3">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-1 w-1/4 text-center"
                    placeholder="9115"
                    onChange={(e) => setSelectedRuangSidang(e.target.value)}
                  />
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
