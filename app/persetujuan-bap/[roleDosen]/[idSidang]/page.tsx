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
import SignaturePad from "signature_pad";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

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

type DataNilaiBAPTypes = {
  idx: number;
  role: string;
  nilai: number;
  persentase: number;
  nilaiAkhir: number;
};

type DataTTDBAPTypes = {
  idTTD: number;
  idSidang: number;
  role: string;
  pathGambarTTD: string;
};

export default function page({ params }: { params: Params }) {
  let { roleDosen, idSidang } = params;
  roleDosen = decodeURIComponent(roleDosen);
  const idSidangInt = parseInt(idSidang);

  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [dataSidang, setDataSidang] = useState<DataSidangTypes>();
  const [tanggalFormated, setTanggalFormated] = useState("");
  const [dataNilaiBAP, setDataNilaiBAP] = useState<DataNilaiBAPTypes[]>();
  const [dataTTDBAP, setDataTTDBAP] = useState<DataTTDBAPTypes[]>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [disableButtonTTD, setDisableButtonTTD] = useState(false);
  const [disableButtonUnduhPDF, setDisableButtonUnduhPDF] = useState(true);

  const [fileTTD, setFileTTD] = useState<File | null>(null);
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

      setTanggalFormated(formatTanggal);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<DataNilaiBAPTypes[]>(
        "http://localhost:5000/api/sidang/bapSidang",
        {
          params: {
            idSidang: idSidangInt,
          },
        }
      );

      const dataWithIndex = data?.map((item, index) => ({
        ...item,
        idx: index + 1,
      }));

      console.log(dataWithIndex);

      setDataNilaiBAP(dataWithIndex);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<DataTTDBAPTypes[]>(
        "http://localhost:5000/api/sidang/ttdBapSidang",
        {
          params: {
            idSidang: idSidangInt,
          },
        }
      );
      console.log(data);

      data.map((currData) => {
        if (currData.role === roleDosen && currData.pathGambarTTD != null) {
          setDisableButtonTTD(true);
        }
      });

      if (data.length === 5) {
        setDisableButtonUnduhPDF(false);
      }

      setDataTTDBAP(data);
    };

    fetchData();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.strokeStyle = "black"; // Ensure black drawing color
    ctx.lineWidth = 2; // Set line thickness
    ctx.lineCap = "round"; // Smooth line endings

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.strokeStyle = "black"; // Ensure black drawing color
    ctx.lineWidth = 2; // Set line thickness
    ctx.lineCap = "round"; // Smooth line endings

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) ctx.beginPath();
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearCanvas();
      // You would typically handle file preview or upload here
    }
  };

  const isCanvasEmpty = (canvas: HTMLCanvasElement): boolean => {
    if (!canvas) return true;

    const context = canvas.getContext("2d");
    if (!context) return true;

    const { width, height } = canvas;
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Check if all pixels are transparent black (0, 0, 0, 0)
    for (let i = 0; i < pixels.length; i += 4) {
      if (
        pixels[i] !== 0 || // Red
        pixels[i + 1] !== 0 || // Green
        pixels[i + 2] !== 0 || // Blue
        pixels[i + 3] !== 0 // Alpha
      ) {
        return false; // A non-default pixel was found
      }
    }

    return true; // All pixels are default
  };

  const handleSubmitSignature = async () => {
    const canvas = canvasRef.current;
    let isEmpty: Boolean;
    if (canvas) {
      isEmpty = isCanvasEmpty(canvas);
    }

    const fileInput = fileInputRef.current?.files?.[0];

    const handleTTD = async () => {
      if (!isEmpty) {
        if (fileInput) {
          Swal.fire({
            title: "Error!",
            text: "Hanya Boleh Masukan 1 Tanda Tangan!",
            icon: "error",
            confirmButtonText: "OK",
          });
          return null;
        } else {
          const ctx = canvas?.getContext("2d");
          if (ctx && canvas) {
            // Create a new canvas with white background
            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;
            const newCtx = newCanvas.getContext("2d");

            // Fill new canvas with white
            if (newCtx) {
              newCtx.fillStyle = "white";
              newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

              // Draw the original canvas content onto the new canvas
              newCtx.drawImage(canvas, 0, 0);
            }

            const signatureImage = newCanvas.toDataURL("image/png");
            const response = await fetch(signatureImage);
            const blob = await response.blob();
            const file = new File([blob], "signature.png", {
              type: "image/png",
            });
            return file;
          }
        }
      } else if (fileInput) {
        return fileInput;
      } else {
        Swal.fire({
          title: "Error!",
          text: "Tanda Tangan Harus Dimasukan!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return null;
      }
    };

    const file = await handleTTD();
    if (file) {
      setFileTTD(file);

      const formData = new FormData();

      formData.append("idSidang", idSidangInt.toString());
      formData.append("role", roleDosen);

      formData.append("gambarTTD", file);

      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/sidang/ttdBapSidang",
          formData
        );

        if (data) {
          Swal.fire({
            title: "Success!",
            text: "Berhasil Menyimpan Tanda Tangan!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {
            location.reload();
          });
        }

        router.push(`/persetujuan-bap/${roleDosen}/${idSidangInt}`);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Gagal Menyimpan Tanda Tangan, Silakan Coba Lagi!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleDownloadPDF = async () => {
    const input = printRef.current;
    if (!input) return;

    try {
      const buttons = input.querySelectorAll("Button, a");
      buttons.forEach((element) => {
        (element as HTMLElement).style.display = "none";
      });
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4", // Explicitly set A4 format
      });

      // A4 standard dimensions
      const pageWidth = 210; // mm
      const pageHeight = 297; // mm
      const margin = 10; // mm

      // Enhanced html2canvas options
      const canvas = await html2canvas(input, {
        scale: 4, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "white",
        // foreignObjectRendering: true,
        imageTimeout: 0,
        windowWidth: 794, // A4 width in pixels (210mm * 3.78 pixels/mm)
        windowHeight: 1123, // A4 height in pixels (297mm * 3.78 pixels/mm)
      });

      buttons.forEach((element) => {
        (element as HTMLElement).style.display = "";
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth - margin * 2;
      const scaleFactor = imgWidth / canvas.width;
      const imgHeight = canvas.height * scaleFactor;

      // Add image to PDF
      pdf.addImage(
        imgData,
        "JPEG",
        margin, // X position
        margin, // Y position
        imgWidth, // Width
        imgHeight, // Height
        undefined,
        "FAST"
      );

      // Save PDF
      pdf.save(
        `Berita_Acara_Sidang_${dataSidang?.namaMahasiswa || "Mahasiswa"}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal membuat PDF, silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    // bagian lama
    // const input = printRef.current;
    // if (!input) return;

    // try {
    //   // Hide buttons before capturing
    //   const buttons = input.querySelectorAll("Button");
    //   buttons.forEach((button) => {
    //     (button as HTMLButtonElement).style.display = "none";
    //   });

    //   const Links = input.querySelectorAll("a");
    //   Links.forEach((button) => {
    //     button.style.display = "none";
    //   });

    //   // Create PDF document
    //   const pdf = new jsPDF({
    //     orientation: "portrait",
    //     unit: "mm",
    //     format: "a4",
    //   });

    //   // A4 dimensions in mm
    //   const pageWidth = 210;
    //   const pageHeight = 297;
    //   const margin = 10;

    //   // Capture the entire content with improved settings
    //   const canvas = await html2canvas(input, {
    //     scale: 3, // Higher scale for better quality
    //     useCORS: true,
    //     logging: false,
    //     allowTaint: true,
    //     backgroundColor: "white", // Ensure white background
    //     imageTimeout: 0, // Remove image timeout
    //   });

    //   // Convert canvas to image
    //   const imgData = canvas.toDataURL("image/jpeg", 1.0);

    //   // Calculate scaling to fit the entire page
    //   const imgWidth = pageWidth - margin * 2;
    //   const scaleFactor = imgWidth / canvas.width;
    //   const imgHeight = canvas.height * scaleFactor;

    //   // If content fits on one page
    //   if (imgHeight <= pageHeight - margin * 2) {
    //     pdf.addImage(
    //       imgData,
    //       "JPEG",
    //       margin,
    //       margin,
    //       imgWidth,
    //       imgHeight,
    //       undefined,
    //       "FAST"
    //     );
    //   } else {
    //     // Handle multi-page content
    //     let position = margin;
    //     pdf.addImage(
    //       imgData,
    //       "JPEG",
    //       margin,
    //       position,
    //       imgWidth,
    //       imgHeight,
    //       undefined,
    //       "FAST"
    //     );

    //     // Add additional pages if needed
    //     while (position + imgHeight > pageHeight) {
    //       pdf.addPage();
    //       position -= pageHeight - margin * 2;

    //       pdf.addImage(
    //         imgData,
    //         "JPEG",
    //         margin,
    //         -position,
    //         imgWidth,
    //         imgHeight,
    //         undefined,
    //         "FAST"
    //       );
    //     }
    //   }

    //   // Restore button visibility
    //   buttons.forEach((button) => {
    //     (button as HTMLButtonElement).style.display = "";
    //   });
    //   Links.forEach((button) => {
    //     button.style.display = "";
    //   });

    //   // Save PDF with student name
    //   pdf.save(
    //     `Berita_Acara_Sidang_${dataSidang?.namaMahasiswa || "Mahasiswa"}.pdf`
    //   );
    // } catch (error) {
    //   console.error("Error generating PDF:", error);
    //   Swal.fire({
    //     title: "Error!",
    //     text: "Gagal membuat PDF, silakan coba lagi.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    // }
  };

  const columns = [
    {
      key: "No",
      label: "No",
    },
    {
      key: "Pembimbing/Penguji",
      label: "Pembimbing/Penguji",
    },
    {
      key: "Nilai",
      label: "Nilai",
    },
    {
      key: "Bobot",
      label: "Bobot",
    },
    {
      key: "Nilai Akhir",
      label: "Nilai Akhir",
    },
  ];

  return (
    <div
      className="bg-blue-50 flex items-center justify-center h-screen print:w-[210mm] print:min-h-[297mm] print:m-0 print:p-[10mm]"
      ref={printRef}
      id="printArea"
    >
      <div>
        <div className="text-center mb-2">
          <h1 className="text-5xl font-bold text-blue-500">
            Berita Acara Sidang Skripsi
          </h1>
        </div>

        <Button
          className={`absolute top-4 right-8 bg-violet-500 text-white px-4 py-2 pointer-events-auto ${
            disableButtonUnduhPDF ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          isDisabled={disableButtonUnduhPDF}
          onClick={handleDownloadPDF}
        >
          Unduh PDF
        </Button>

        <div className="mb-2">
          <p className="font-bold text-sm">
            Telah diselenggarakan Review untuk mata kuliah Skripsi{" "}
            {dataSidang?.ta} bagi:
          </p>
          <p className="mt-2">
            <strong>Nama:</strong> {dataSidang?.namaMahasiswa}
          </p>
          <p className="">
            <strong>NPM:</strong> {dataSidang?.npm}
          </p>
          <p className="">
            <strong>Topik:</strong> {dataSidang?.judulSkripsi}
          </p>

          <p className="mt-2 text-sm">dengan pembimbing dan penguji:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Pembimbing utama</strong>:{" "}
              {dataSidang?.namaPembimbingUtama}
            </li>
            <li>
              <strong>Pembimbing pendamping</strong>:{" "}
              {dataSidang?.namaPembimbingPendamping}
            </li>
            <li>
              <strong>Ketua Tim Penguji</strong>:{" "}
              {dataSidang?.namaKetuaTimPenguji}
            </li>
            <li>
              <strong>Anggota Tim Penguji</strong>:{" "}
              {dataSidang?.namaAnggotaTimPenguji}
            </li>
          </ul>
        </div>

        <div className="mb-2">
          <p className="text-sm">
            Rekapitulasi nilai Sidang Skripsi 2 yang diberikan oleh pembimbing,
            penguji & koordinator:
          </p>
          <div className="mt-2">
            <Table
              aria-label="Example table with dynamic content"
              classNames={{
                base: "max-h-[360px] ",
                wrapper: "p-0",
              }}
              radius="none"
            >
              <TableHeader columns={columns} className="p-0">
                {(column) => (
                  <TableColumn
                    key={column.key}
                    className="text-center font-semibold text-sm text-black sticky top-0 bg-default-100 bg-opacity-100 z-10 mt-4"
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={dataNilaiBAP || []}
                emptyContent={"Berita Acara Sidang Skripsi Masih Kosong"}
              >
                {(item) => {
                  return (
                    <TableRow key={item.idx} className="">
                      <TableCell className="text-center font-medium max-w-10 text-[13px]">
                        {item.idx}
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-40 break-words text-[13px]">
                        {item.role}
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-32 break-words text-[13px]">
                        {item.nilai}
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-10 text-[13px]">
                        {item.persentase}
                      </TableCell>
                      <TableCell className="text-center font-medium max-w-10 text-[13px]">
                        {item.nilaiAkhir}
                      </TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="text-center mb-2">
          <p className="font-bold">Ditentukan di Bandung: {tanggalFormated}</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-4">
          {[
            { role: "Ketua Tim Penguji", backendRole: "Ketua Tim Penguji" },
            { role: "Anggota Tim Penguji", backendRole: "Anggota Tim Penguji" },
            { role: "Pembimbing Utama", backendRole: "Pembimbing Utama" },
            { role: "Mahasiswa", backendRole: "Mahasiswa" },
            { role: "Koordinator Skripsi", backendRole: "Koordinator" },
          ].map(({ role, backendRole }) => {
            // Cari tanda tangan berdasarkan role dari data backend
            const signature = dataTTDBAP?.find(
              (ttd) => ttd.role === backendRole
            );

            return (
              <div key={role} className="text-center bg-white h-24 relative ">
                {signature ? (
                  <>
                    <img
                      src={`http://localhost:5000/${signature.pathGambarTTD}`}
                      alt={`${role} Signature`}
                      className="absolute inset-0 object-contain max-h-full max-w-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-300 text-[10px] font-semibold p-1.5">
                      {role === "Pembimbing Utama" ? "Pembimbing**" : role}
                    </div>
                  </>
                ) : (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-300 text-[10px] font-semibold p-1.5">
                    {role === "Pembimbing Utama" ? "Pembimbing**" : role}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`flex ${
            roleDosen != "Pembimbing Pendamping"
              ? "justify-between"
              : "justify-center"
          }`}
        >
          <Button
            as={Link}
            href={`../../navigation/${roleDosen}/${idSidangInt}`}
            className="bg-violet-500 text-white px-8 py-2"
          >
            Kembali
          </Button>
          {roleDosen !== "Pembimbing Pendamping" ? (
            <Button
              className={`bg-violet-500 text-white px-8 py-2 pointer-events-auto ${
                disableButtonTTD ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              isDisabled={disableButtonTTD}
              onPress={onOpen}
            >
              Tanda Tangan
            </Button>
          ) : null}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Masukkan Tanda Tangan
                  </ModalHeader>
                  <ModalBody>
                    <canvas
                      ref={canvasRef}
                      width={350}
                      height={200}
                      className="border border-gray-300 mb-4"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      style={{ cursor: "crosshair" }}
                    />

                    <div className="flex justify-between mb-4">
                      <button
                        onClick={clearCanvas}
                        className="bg-gray-200 text-black px-4 py-2 rounded"
                      >
                        Hapus Tanda Tangan
                      </button>
                    </div>

                    <div className="ml-1 text-sm font-bold">
                      Atau Upload Tanda Tangan
                    </div>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    ></Input>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={onClose}
                      onClick={handleSubmitSignature}
                    >
                      Simpan
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
