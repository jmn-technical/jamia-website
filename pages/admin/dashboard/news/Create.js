import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import cookies from "js-cookie";
import shortid from "shortid";

import dynamic from "next/dynamic";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css";

export default function Component() {
  const [description, setDescription] = useState("");
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };
  const [title, setTitle] = useState("  ");
  const [img, setImg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const getAdmin = () => {
      const adminUser = cookies.get("admin");
      if (adminUser === "false") {
        router.push("/admin/Login");
      }
      getAdmin();
    };
  });

  const handleTitle = (e) => {
    setTitle(e.target.value);
    const value = e.target.value;
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    const fileSizeInKB = file.size / 1024;
    console.log(fileSizeInKB);
    if (fileSizeInKB > 500) {
      alert("File size exceeds 500KB. Please upload a smaller file.");
      setImg(null);
      setFile(null);
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setImg(readerEvent.target.result);
    };
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return;

    setUploading(true);
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
        addBlog(data);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  };
  const addBlog = async (imgData) => {
    const slug = shortid.generate();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: description,
          slug: slug,
          image: imgData.imageUrl,
          imgId: imgData.publicId,
          createdAt: new Date(),
        }),
      });
      router.push("/admin/dashboard/news");
      setUploading(false);
    } catch (error) {
      setUploading(false);
      alert(error);
    }
  };

  return (
    <div>
      <div className="px-5 lg:px-0 lg:w-10/12 m-auto mt-12 pb-24">
        <h4 className="text-2xl font-bold">Create Blog</h4>

        <form onSubmit={handleUpload}>
          <div className="mt-16">
            <div>
              <input
                className="mt-6 border placeholder:text-red-700"
                placeholder="Title"
                value={title}
                onChange={handleTitle}
              />

              <div className="mt-12">
                <Quill
                  className="bg-white  mt-1 "
                  value={description}
                  onChange={handleDescriptionChange}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline", "strike"],
                      [{ align: [] }],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "list",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "align",
                    "link",
                    "image",
                    "video",
                  ]}
                  placeholder="Add a Description"
                />
                <div className="mt-10 ">
                  <p className="text-lg font-bold">Image</p>
                  <div className="grid grid-cols-2 border p-5 mt-6">
                    <input
                      onChange={handleImg}
                      type="file"
                      className="mt-4 m-auto"
                    />

                    <div className="border w-fit">
                      <img style={{ maxWidth: "200px" }} src={img} />
                      {img ? (
                        <button
                          className="p-1 bg-red-500 text-white m-auto w-full mt-2"
                          onClick={() => setImg(null)}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex w-full mt-24">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="m-auto bg-green-500 p-2 w-4/12 text-white rounded"
                  >
                    {uploading ? "UPLOADING..." : "UPLOAD"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
