"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Selection,
} from "@nextui-org/react";
import Link from "next/link";
import { showToast } from "@/app/utils/showToast";
import Swal from "sweetalert2";

type MahasiswaTypes = {
  namaMahasiswa: string;
  emailMahasiswa: string;
  npmMahasiswa: string;
};

type DosenTypes = {
  emailDosen: string;
  namaDosen: string;
};

export default function TambahDataSidang() {
  const router = useRouter();
  const [dataMahasiswa, setDataMahasiswa] = useState<MahasiswaTypes[]>();
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<MahasiswaTypes>();

  const [dataDosen, setDataDosen] = useState<DosenTypes[]>();
  const [selectedDosenPembimbingUtama, setSelectedDosenPembimbingUtama] =
    useState("");
  const [
    selectedDosenPembimbingPendamping,
    setSelectedDosenPembimbingPendamping,
  ] = useState("");
  const [selectedDosenPengujiUtama, setSelectedDosenPengujiUtama] =
    useState("");
  const [selectedDosenPengujiPendamping, setSelectedDosenPengujiPendamping] =
    useState("");

  const [selectedNama, setSelectedNama] = useState<Selection>(new Set([]));
  const [selectedNPM, setSelectedNPM] = useState<Selection>(new Set([]));
  const [judulSkripsi, setJudulSkripsi] = useState("");

  const [jenisSkripsi, setJenisSkripsi] = useState(1);
  const [tahunAkademik, setTahunAkademik] = useState("");

  useEffect(() => {
    const fetchDataMahasiswa = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/koordinator/mahasiswa-belum-sidang"
      );

      setDataMahasiswa(data);
    };

    const fetchDataDosen = async () => {
      const { data } = await axios.get("http://localhost:5000/api/dosen/all");
      setDataDosen(data);
    };

    fetchDataMahasiswa();
    fetchDataDosen();
  }, []);

  const handleNamaChange = (keys: Selection) => {
    const namaValue = Array.from(keys)[0] as string;
    setSelectedNama(keys);

    const mahasiswa = dataMahasiswa?.find((m) => m.namaMahasiswa === namaValue);
    if (mahasiswa) {
      setSelectedMahasiswa(mahasiswa);
      setSelectedNPM(new Set([mahasiswa.npmMahasiswa]));
    }
  };

  const handleNpmChange = (keys: Selection) => {
    const npmValue = Array.from(keys)[0] as string;
    setSelectedNPM(keys);

    const mahasiswa = dataMahasiswa?.find((m) => m.npmMahasiswa === npmValue);
    if (mahasiswa) {
      setSelectedMahasiswa(mahasiswa);
      setSelectedNama(new Set([mahasiswa.namaMahasiswa]));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !selectedMahasiswa ||
      !judulSkripsi ||
      !jenisSkripsi ||
      !tahunAkademik ||
      !selectedDosenPembimbingUtama ||
      !selectedDosenPembimbingPendamping ||
      !selectedDosenPengujiUtama ||
      !selectedDosenPengujiPendamping
    ) {
      Swal.fire({
        title: "Error!",
        text: "Semua Field Harus Diisi!",
        icon: "error",
        confirmButtonText: "Confirm",
      });
    } else {
      const dataDosen = [
        selectedDosenPembimbingUtama,
        selectedDosenPembimbingPendamping,
        selectedDosenPengujiUtama,
        selectedDosenPengujiPendamping,
      ];

      let dosenValid = true;
      for (let i = 0; i < dataDosen.length; i++) {
        for (let j = i + 1; j < dataDosen.length; j++) {
          if (dataDosen[i] !== "" && dataDosen[i] === dataDosen[j]) {
            dosenValid = false;
          }
        }
      }

      if (!dosenValid) {
        Swal.fire({
          title: "Error!",
          text: "Tidak Boleh Ada Dosen Pembimbing atau Penguji yang Sama!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else {
        console.log({
          emailMahasiswa: selectedMahasiswa.emailMahasiswa,
          judulSkripsi: judulSkripsi,
          TA: jenisSkripsi,
          tahunAjaran: tahunAkademik,
          emailPembimbingUtama: selectedDosenPembimbingUtama,
          emailPembimbingPendamping: selectedDosenPembimbingPendamping,
          emailPengujiUtama: selectedDosenPengujiUtama,
          emailPengujiPendamping: selectedDosenPengujiPendamping,
        });
        try {
          const { data } = await axios.post(
            "http://localhost:5000/api/koordinator/tambah-data-sidang",
            {
              emailMahasiswa: selectedMahasiswa.emailMahasiswa,
              judulSkripsi: judulSkripsi,
              TA: jenisSkripsi,
              tahunAjaran: tahunAkademik,
              emailPembimbingUtama: selectedDosenPembimbingUtama,
              emailPembimbingPendamping: selectedDosenPembimbingPendamping,
              emailPengujiUtama: selectedDosenPengujiUtama,
              emailPengujiPendamping: selectedDosenPengujiPendamping,
            }
          );

          if (data) {
            Swal.fire({
              title: "Success!",
              text: "Data Sidang Berhasil Ditambah!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              location.reload();
            });
          }
        } catch (error: any) {
          Swal.fire({
            title: "Error!",
            text: `${error.response.statusText}`,
            icon: "error",
            confirmButtonText: "Confirm",
          });
        }
      }
    }
  };

  const jenisSkripsiList = [
    {
      key: "1",
      label: "1",
    },
    {
      key: "2",
      label: "2",
    },
  ];

  const tahunAkademikList = [
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

  return (
    <div className="bg-blue-50 w-screen max-h-screen overflow-x-hidden">
      <h1 className="text-5xl font-bold text-blue-400 text-center py-10">
        Tambah Data Sidang
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex flex-col w-1/4 mt-3">
          <label htmlFor="nama">Nama Mahasiswa</label>
          <Select
            label="Pilih Nama Mahasiswa"
            selectedKeys={selectedNama}
            onSelectionChange={(e) => handleNamaChange(e)}
          >
            {(dataMahasiswa || []).map((mahasiswa) => (
              <SelectItem
                key={mahasiswa.namaMahasiswa}
                value={mahasiswa.namaMahasiswa}
              >
                {mahasiswa.namaMahasiswa}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col w-1/4 mt-3">
          <label htmlFor="npm">NPM Mahasiswa</label>
          <Select
            label="Pilih NPM Mahasiswa"
            selectedKeys={selectedNPM}
            onSelectionChange={(e) => handleNpmChange(e)}
          >
            {(dataMahasiswa || []).map((mahasiswa) => (
              <SelectItem
                key={mahasiswa.npmMahasiswa}
                value={mahasiswa.npmMahasiswa}
              >
                {mahasiswa.npmMahasiswa}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col w-1/4 mt-3">
          <label htmlFor="judul">Judul Skripsi</label>
          <Input
            type="text"
            label="Masukan Judul Skripsi"
            // className="w-72"
            onChange={(e) => setJudulSkripsi(e.target.value)}
          ></Input>
        </div>
        <div className="flex flex-col w-1/4 mt-3">
          <label htmlFor="jenis">Jenis Skripsi</label>
          <Select
            label="Pilih Jenis TA"
            onChange={(e) => setJenisSkripsi(Number(e.target.value))}
          >
            {jenisSkripsiList.map((jenis) => (
              <SelectItem key={jenis.key} value={jenis.label}>
                {jenis.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col w-1/4  mt-3">
          <label htmlFor="tahun">Tahun Akademik</label>
          <Select
            label="Pilih Tahun Akademik"
            onChange={(e) => setTahunAkademik(e.target.value)}
          >
            {tahunAkademikList.map((tahunAkademik) => (
              <SelectItem key={tahunAkademik.key} value={tahunAkademik.label}>
                {tahunAkademik.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-10 w-1/2">
          <div className="flex flex-col w-full mt-5">
            <label htmlFor="pembimbingUtama">Dosen Pembimbing Utama</label>
            <Select
              label="Pilih Dosen Pembimbing Utama"
              onChange={(e) => setSelectedDosenPembimbingUtama(e.target.value)}
            >
              {(dataDosen || [])?.map((dosen) => (
                <SelectItem key={dosen.emailDosen} value={dosen.namaDosen}>
                  {dosen.namaDosen}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col w-full mt-5">
            <label htmlFor="pembimbingPendamping">
              Dosen Pembimbing Pendamping
            </label>
            <Select
              label="Pilih Dosen Pembimbing Pendamping"
              onChange={(e) =>
                setSelectedDosenPembimbingPendamping(e.target.value)
              }
            >
              {(dataDosen || [])?.map((dosen) => (
                <SelectItem key={dosen.emailDosen} value={dosen.namaDosen}>
                  {dosen.namaDosen}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 w-1/2">
          <div className="flex flex-col w-full mt-5">
            <label htmlFor="ketuaPenguji">Ketua Tim Penguji</label>
            <Select
              label="Pilih Dosen Penguji"
              onChange={(e) => setSelectedDosenPengujiUtama(e.target.value)}
            >
              {(dataDosen || [])?.map((dosen) => (
                <SelectItem key={dosen.emailDosen} value={dosen.namaDosen}>
                  {dosen.namaDosen}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col w-full mt-5">
            <label htmlFor="anggotaPenguji">Anggota Tim Penguji</label>
            <Select
              label="Pilih Dosen Penguji"
              onChange={(e) =>
                setSelectedDosenPengujiPendamping(e.target.value)
              }
            >
              {(dataDosen || [])?.map((dosen) => (
                <SelectItem key={dosen.emailDosen} value={dosen.namaDosen}>
                  {dosen.namaDosen}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 w-1/2 py-10">
          <Button
            className="bg-violet-500 w-1/2 text-white center justify-self-center"
            as={Link}
            href={"/"}
          >
            KEMBALI
          </Button>
          <Button
            className="bg-violet-500 w-1/2 text-white center justify-self-center"
            type="submit"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}