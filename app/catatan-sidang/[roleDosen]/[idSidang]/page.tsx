"use client";
import { useEffect, useState } from "react";
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

type Params = {
  roleDosen: string;
  idSidang: string;
};

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  console.log(roleDosen);
  const idSidangInt = parseInt(idSidang);
  const [catatanSidang, setCatatanSidang] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/sidang/catatanSidang",
        {
          params: {
            idSidang: idSidangInt,
          },
        }
      );
      console.log(data);

      setCatatanSidang(data);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.patch(
        "http://localhost:5000/api/sidang/catatanSidang",
        {
          idSidang: idSidangInt,
          isiCatatan: catatanSidang,
        }
      );

      if (data) {
        Swal.fire({
          title: "Success!",
          text: "Catatan Sidang Berhasil Disimpan!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Gagal Menyimpan Catatan Sidang, Silahkan Coba Lagi!`,
        icon: "error",
        confirmButtonText: "Confirm",
      });
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex flex-col items-center overflow-hidden">
      <h1 className="text-7xl font-bold text-center text-blue-400 my-10 absolute">
        Catatan Sidang
      </h1>

      <div className="h-full flex flex-col justify-center items-center w-3/4 mt-32">
        {roleDosen != "Pembimbing Utama" ? (
          <>
            <textarea
              className="bg-white shadow-md rounded-lg p-8 h-2/3 overflow-y-scroll w-full"
              defaultValue={catatanSidang}
              readOnly
            ></textarea>

            <Button
              as={Link}
              href={`/navigation/${roleDosen}/${idSidangInt}`}
              size="lg"
              className="bg-violet-500 text-white mt-10"
            >
              Kembali
            </Button>
          </>
        ) : (
          <>
            <textarea
              className="bg-white shadow-md rounded-lg p-8 h-2/3 overflow-y-scroll w-full break-words"
              value={catatanSidang}
              onChange={(e) => setCatatanSidang(e.target.value)}
            ></textarea>
            <div className="flex w-full justify-around">
              <Button
                as={Link}
                href={`/navigation/${roleDosen}/${idSidangInt}`}
                size="lg"
                className="bg-violet-500 text-white mt-10"
              >
                Kembali
              </Button>

              <Button
                size="lg"
                className="bg-violet-500 text-white mt-10"
                onClick={handleSubmit}
              >
                Simpan
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
