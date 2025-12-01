import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { FaArrowRightLong } from "react-icons/fa6";
import cookies from "js-cookie";
import AdminNav from "../../../components/AdminNav";

export default function Dash() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [poster, setPoster] = useState([]);
 
  useEffect(() => {
    const adminUser = cookies.get("admin");

    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  });

  const getNews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {});
      const { data } = await res.json();
      setNews(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPoster = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/poster`, {});
      const { data } = await res.json();
      setPoster(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNews();
    getPoster();
  }, []);
  return (
    <div>
      <AdminNav />

      <div className="px-5 lg:px-0 lg:w-10/12 m-auto mt-12">
        <h4 className="text-2xl font-bold text-center">DASHBOARD</h4>

        <div className="mt-16 grid grid-cols-2 gap-7 lg:w-8/12 m-auto">
          <Link href={"/admin/dashboard/news"}>
            <div className="border-t border-gray-100 shadow-md w-fi p-5 py-10 cursor-pointer hover:scale-105 transition duration-200 ease-linear">
              <div className="flex items-center justify-center">
                <p className="text-lg font-semibold">News</p>
                <FaArrowRightLong className="ml-4" />
                <div className="h-9 w-9 p-1 text-white bg-emerald-500 flex justify-center items-center ml-4 rounded-full">
                  <p>{news.length}</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href={"/admin/dashboard/posters"}>
            <div className="border-t border-gray-100 shadow-md w-fi p-5 py-10 cursor-pointer hover:scale-105 transition duration-200 ease-linear">
              <div className="flex items-center justify-center">
                <p className="text-lg font-semibold">Posters</p>
                <FaArrowRightLong className="ml-4" />
                <div className="h-9 w-9 p-1 text-white bg-emerald-500 flex justify-center items-center ml-4 rounded-full">
                  <p>{poster.length}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
