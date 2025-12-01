import React, { useEffect, useState } from "react";
import AdminNav from "../../../../components/AdminNav";
 

import { IoIosCloseCircle } from "react-icons/io";

import cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Index() {
  const [img, setImg] = useState("");
 
  const [data, setData] = useState([]);

  const [deleting, setDeleting] = useState("false");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const adminUser = cookies.get("admin");

    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  });

  const getData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/poster`, {});
      const { data } = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleImg = (e) => {
    const file = e.target.files[0];
    const fileSizeInKB = file.size / 1024;
    console.log(fileSizeInKB);
    if (fileSizeInKB > 500) {
      alert("File size exceeds 500KB. Please upload a smaller file.");
      setIsOpen(false);
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setImg(readerEvent.target.result);
    };
  };

  const addPoster = async (data) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/poster`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: data.imageUrl,
          imgId: data.publicId,
          timeStamp: new Date(),
        }),
      });

      setIsUploading(false);
      setIsOpen(false);
      getData();
      setImg(null);
      setFile(null);
    } catch (error) {
      setIsUploading(false);
      alert(error);
    }
  };

  const deleteDoc = async (docId) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/poster/delete/${docId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setDeleting("");
      getData();
    } catch (error) {
      setDeleting(false);
      alert(error);
    }
  };
  const handleDelete = async (docId, publicId) => {
    setDeleting(docId);
    try {
      const response = await fetch("/api/deleteImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);  
        deleteDoc(docId);
      } else {
        throw new Error(data.error || "Deletion failed");
      }
    } catch (error) {
      alert("Delete error: " + error.message);
    }
  };

 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.imageUrl);
        addPoster(data);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  };

  return (
    <div>
      <AdminNav />

      <div className="px-4 md:px-0 md:w-10/12 m-auto py-14">
        <div className="flex justify-between ">
          <h4 className="text-lg font-semibold">Posters</h4>{" "}
          <button
            className="bg-emerald-600 py-1 px-7 text-white rounded "
            onClick={() => setIsOpen(true)}
          >
            Add
          </button>
        </div>

        <div className=" mt-10 gap-5 grid md:grid-cols-2 lg:grid-cols-4">
          {data?.map((d) => {
            return (
              <div key={d.imgId}>
                <img src={d?.image} />

               {d.image &&  <button
                  className="p-1 bg-red-500 text-white m-auto w-full mt-2 rounded"
                  onClick={() => handleDelete(d._id, d.imgId)}
                >
                  {deleting === d._id ? "DELETING" : "DELETE"}
                </button>}
              </div>
            );
          })}
        </div>
      </div>

        {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        
        <div className="relative p-4 pb-0">
          <h4 className="text-md font-semibold">Select A Poster</h4>
          <IoIosCloseCircle
            className="absolute right-4 top-4 text-2xl text-red-500"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <form onSubmit={handleUpload}>
          <div className="  p-5   w-10/12">
            {!file ? (
              <input
                onChange={handleImg}
                accept="image/*"
                type="file"
                className="  m-auto"
              />
            ) : (
              ""
            )}

            {file ? (
              <div className="border w-fit">
                <img style={{ maxWidth: "300px" }} src={img} />
                
                <button
                  className="p-1 bg-red-500 text-white m-auto w-full mt-2 rounded"
                  onClick={() => setFile(null)}
                >
                  CHANGE
                </button>

                <button
                  className="p-1 bg-emerald-500 text-white m-auto w-full mt-4 rounded"
                  
                  type="submit"
                  disabled={isUploading}
                >
                  {isUploading ? "UPLOADING..." : " UPLOAD"}
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </form>

      </div>
    </div>}
    </div>
  );
}
