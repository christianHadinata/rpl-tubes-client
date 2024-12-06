"use client";
import React, { useState } from "react";
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
} from "@nextui-org/react";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";

type Params = {
  selectedRole: string;
  jumlahKomponen: string;
  persentaseNilai: string;
};
export default function page({ params }: { params: Params }) {
  let { selectedRole, jumlahKomponen, persentaseNilai } = params;
  selectedRole = decodeURIComponent(selectedRole);
  const banyakKomponen = parseInt(jumlahKomponen);
  const persentaseNilaiFloat = parseFloat(persentaseNilai);

  const router = useRouter();

  const [arrNamaKomponen, setArrNamaKomponen] = useState<string[]>(
    Array(banyakKomponen).fill("")
  );
  const [arrBobotKomponen, setArrBobotKomponen] = useState<string[]>(
    Array(banyakKomponen).fill("")
  );

  const handleArrNamaKomponenChange = (index: number, value: string) => {
    const newArrNamaKomponen = [...arrNamaKomponen];
    newArrNamaKomponen[index] = value;
    setArrNamaKomponen(newArrNamaKomponen);
  };

  const handleArrBobotKomponenChange = (index: number, value: string) => {
    const newArrBobotKomponen = [...arrBobotKomponen];
    newArrBobotKomponen[index] = value;
    setArrBobotKomponen(newArrBobotKomponen);
  };

  const handleSubmit = async () => {
    let statusValid = true;

    for (let i = 0; i < banyakKomponen; i++) {
      if (arrNamaKomponen[i] == "" || arrBobotKomponen[i] == "") {
        statusValid = false;
        break;
      }
    }

    if (!statusValid) {
      Swal.fire({
        title: "Error!",
        text: `Semua Komponen dan Bobot Harus Diisi!`,
        icon: "error",
        confirmButtonText: "Confirm",
      });
    } else {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/koordinator/komponen-bobot",
          {
            selectedRole,
            banyakKomponen,
            persentaseNilai: persentaseNilaiFloat,
            arrNamaKomponen,
            arrBobotKomponen,
          }
        );

        if (data) {
          Swal.fire({
            title: "Success!",
            text: "Komponen dan Bobot Penilaian Berhasil Ditambah!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {
            router.push("/koordinator/komponen-dan-bobot");
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
  };

  return (
    <div className="bg-blue-50 w-screen h-screen overflow-x-hidden flex flex-col items-center">
      <h1 className="text-6xl font-bold text-blue-400 text-center pt-10 pb-5">
        Komponen Dan Bobot Penilaian
      </h1>
      <div className=" m-7 w-10/12 h-10/12 bg-gray-200/70">
        <form
          action=""
          method="post"
          className="flex flex-col items-center p-5 h-full"
        >
          <div className="grid grid-cols-[30%,1fr] bg-white w-full">
            <label
              htmlFor="role"
              className="border-solid border-r-2 border-b-2 border-gray-150 h-10 content-center pl-4"
            >
              Role
            </label>
            <label
              htmlFor="teksRole"
              className="border-solid border-b-2 border-gray-150 h-10 content-center pl-4"
            >
              {selectedRole}
            </label>

            <label
              htmlFor="persentase"
              className="border-solid border-r-2 border-b-2 border-gray-150 h-10 content-center pl-4"
            >
              Persentase Penilaian
            </label>
            <div className="border-solid border-b-2 border-gray-150 h-10 content-center pl-4 flex items-center">
              <div id="persentase">{persentaseNilaiFloat}%</div>
            </div>

            <label
              htmlFor="komponenPenilaian"
              className="border-solid border-r-2 border-b-2 border-gray-150 h-10 content-center pl-4 "
            >
              Komponen Penilaian
            </label>
            <div className="border-solid border-l-1 border-gray-150 content-center pl-4 pb-4">
              <label
                htmlFor=""
                className="h-10 text-center inline-block content-center"
              >
                {banyakKomponen} Jenis Penilaian
              </label>
              <div className="grid grid-cols-[1fr,60px,40px]">
                {Array.from({ length: banyakKomponen }, (_, index) => (
                  <>
                    <input
                      type="text"
                      className="border-solid border-2 border-gray-150 rounded-sm h-18 content-center mt-1 mr-1 mb-1 px-1 "
                      onChange={(e) =>
                        handleArrNamaKomponenChange(index, e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border-solid border-2 border-gray-150 rounded-sm h-18 content-center mt-1 ml-1 mb-1 px-1"
                      onChange={(e) =>
                        handleArrBobotKomponenChange(index, e.target.value)
                      }
                    />
                    <label htmlFor="" className="text-center m-2">
                      %
                    </label>
                  </>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-10 w-screen">
        <Button
          as={Link}
          href="/koordinator/komponen-dan-bobot"
          className="bg-violet-500 w-1/3 text-white center justify-self-center h-10 rounded-sm"
        >
          KEMBALI
        </Button>
        <Button
          className="bg-violet-500 w-1/3 text-white center justify-self-center h-10 rounded-sm"
          onClick={() => handleSubmit()}
        >
          SIMPAN
        </Button>
      </div>
    </div>
  );
}
