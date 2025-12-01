import formatDate from "../../../../functions/formatDate";
 
import Link from "next/link";
import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import AdminNav from "../../../../components/AdminNav";
import { useRouter } from "next/router";

export default function Component() {
  const [data, setData] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [unPublishing, setUnPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {});
      const { data } = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const publishBlog = async (_id) => {
    setPublishing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: true,
            publishedAt: new Date(),
          }),
        }
      );

      setPublishing(false);
      getData();
    } catch (error) {
      setPublishing(false);
      alert(error);
    }
  };

  const unPublishBlog = async (_id) => {
    setUnPublishing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: false,
          }),
        }
      );

      setUnPublishing(false);
      getData();
    } catch (error) {
      setUnPublishing(false);
      alert(error);
    }
  };

  const handleDelete = async (docId, publicId) => {
    setDeleting(true);
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
     
        deleteBlog(docId);
      } else {
        throw new Error(data.error || "Deletion failed");
      }
    } catch (error) {
      alert("Delete error: " + error.message);
    }
  };
  const deleteBlog = async (_id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news/${_id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setDeleting(false);

      getData();
    } catch (error) {
      setDeleting(false);
      alert(error);
    }
  };

 

  const router = useRouter();
  useEffect(() => {
    const adminUser = cookies.get("admin");

    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  });
  return (
    <div>
      <AdminNav />
      <div className="px-5 lg:px-0 lg:w-10/12 m-auto mt-12">
        <div className="flex justify-between">
          <h4 className="text-2xl font-bold">All News</h4>
          <Link href={"/admin/dashboard/news/Create"}>
            <button className="bg-emerald-600 py-1 px-7 text-white rounded ">
              Add News
            </button>
          </Link>
        </div>

        <div className="mt-6">
          {data?.map((d) => {
            const createdAt = formatDate(new Date(d?.createdAt));
            const publishedAt = formatDate(new Date(d?.publishedAt));
            return (
              <div key={d.title} className="border  mt-10 p-4 lg:p-10">
                <div className="grid gap-7 lg:grid-cols-2 ">
                  <img width={300} src={d?.image} alt={d?.image} />{" "}
                  <div>
                    <div className="flex w-full  ">
                      <div className="bg-gray-100 p-2 w-full">
                        <p className="text-sm text-center text-gray-600">
                          Created{" "}
                        </p>
                        <p className="text-sm text-center mt-1">{createdAt} </p>
                      </div>
                      <div className="bg-gray-100 p-2 w-full ml-2">
                        {d?.isPublished ? (
                          <div>
                            <p className="text-sm text-center text-gray-600">
                              Published{" "}
                            </p>
                            <p className="text-sm text-center mt-1">
                              {publishedAt}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-center text-gray-600">
                            Not Published{" "}
                          </p>
                        )}
                      </div>
                    </div>
                    {d?.isPublished ? (
                      <button
                        onClick={() => unPublishBlog(d?._id)}
                        className="bg-emerald-400 text-white p-2 w-full rounded mt-8"
                      >
                        {unPublishing ? "Unpublishing..." : "     Unpublish"}
                      </button>
                    ) : (
                      <button
                        onClick={() => publishBlog(d?._id)}
                        className="bg-emerald-400 text-white p-2 w-full rounded mt-8"
                      >
                        {publishing ? "Publishing..." : "     Publish"}
                      </button>
                    )}
                  
                    <button
                      onClick={() => handleDelete(d?._id, d.imgId)}
                      className="bg-red-500 text-white p-2 w-full rounded mt-8"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-scroll overflow-x-hidden mt-4">
                  <h1 className="text-xl font-bold mt-6">{d?.title}</h1>
                  <div
                    dangerouslySetInnerHTML={{ __html: d?.content }}
                    className="mt-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
