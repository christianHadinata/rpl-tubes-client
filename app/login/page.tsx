"use client";

import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Button, ButtonGroup } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon ";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      console.log(data.token);

      // localStorage.setItem("token", data.token);
      // router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex  h-screen w-full items-center justify-center bg-blue-50">
        <div className="w-2/3 grid grid-cols-[0.65fr_0.35fr]">
          <div>
            <div>
              <h1 className="text-6xl text-blue-500">
                Berita Acara Pelaksanaan
                <br />
                Sidang Skripsi
              </h1>
            </div>
            <div>
              <h2 className="text-xl text-slate-400 pt-5">
                Selamat datang kembali! Silahkan login dengan akun unpar anda.
              </h2>
            </div>
            <form className="pt-10" onSubmit={handleSubmit}>
              <Input
                isRequired
                isClearable
                type="email"
                label="Email"
                placeholder="Enter your email"
                color="primary"
                className="max-w-md mb-5"
                size="lg"
                classNames={{
                  label: "text-black",
                  inputWrapper: "bg-white",
                  mainWrapper: "bg-white",
                  input: [
                    "bg-white",
                    "text-black",
                    "placeholder:text-slate-400",
                  ],
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                className="max-w-md "
                color="primary"
                size="lg"
                classNames={{
                  label: "text-black",
                  inputWrapper: "bg-white",
                  mainWrapper: "bg-white",
                  input: [
                    "bg-white",
                    "text-black",
                    "placeholder:text-slate-400",
                  ],
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                onChange={(e) => setPassword(e.target.value)}
                type={isVisible ? "text" : "password"}
              />
              <div className="pt-10">
                <Button color="primary" size="lg" type="submit">
                  Log in
                </Button>
              </div>
            </form>
          </div>
          <Image
            src={"/logo-unpar.png"}
            width={400}
            height={400}
            alt="logo-unpar"
          ></Image>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
