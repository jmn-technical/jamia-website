// import React, { useEffect, useState } from "react";

// import Image from "next/image";
// import Link from "next/link";
// import formatDate from "../functions/formatDate";
// const NewsSection = () => {
//   const [data, setData] = useState([]);

//   const getData = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_PORT}/api/news/limit`,
//         {}
//       );
//       const { data } = await res.json();
//       setData(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <section
//       className="py-16 bg-gray-50"
//       data-aos="fade-up"
//       data-aos-duration="1000"
//     >
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-12">
//           <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">
//             What&apos;s New
//           </h2>
//           <div className="hidden md:grid">
//             <Link passHref href={`/Newses`}>
//               <button className="px-6  py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
//                 View More News
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* News Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {data?.map((news) => (
//             <div
//               key={news?.publishedAt}
//               className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               {/* News Image */}
//               <div className="h-56 relative">
//                 {news.image && (
//                   <Image
//                     src={news.image}
//                     alt={news.title}
//                     layout="fill"
//                     className="object-cover object-top"
//                   />
//                 )}
//               </div>

//               {/* News Content */}
//               <div className="p-6">
//                 <span className="text-sm text-gray-500">
//                   {formatDate(new Date(news?.publishedAt))}
//                 </span>
//                 <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2">
//                   {news.title}
//                 </h3>
//                 <Link passHref href={`/news/${news?.slug}`}>
//                   <button className="text-secondary hover:text-primary font-medium flex items-center">
//                     Read More
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 ml-1"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className=" md:hidden flex">
//           <Link passHref href={`/Newses`}>
//             <button className="px-6 m-auto mt-10  py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
//               View More
//             </button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;


import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import formatDate from "../functions/formatDate";

const NewsSection = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/limit`
      );
      const { data } = await res.json();
      setData(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section
      className="py-16 bg-gray-50"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">
            What&apos;s New
          </h2>
          <div className="hidden md:grid">
            <Link passHref href={`/Newses`}>
              <button className="px-6  py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
                View More News
              </button>
            </Link>
          </div>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((news) => {
            const rawDate = news.publishedAt || news.createdAt || null;
            const displayDate = rawDate
              ? formatDate(new Date(rawDate))
              : "";

            return (
              <div
                key={news._id || news.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* News Image */}
                <div className="h-56 relative">
                  {news.image && (
                    <Image
                      src={news.image}
                      alt={news.title}
                      layout="fill"
                      className="object-cover object-top"
                    />
                  )}
                </div>

                {/* News Content */}
                <div className="p-6">
                  <span className="text-sm text-gray-500">
                    {displayDate || " "}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2">
                    {news.title}
                  </h3>
                  <Link passHref href={`/news/${news?.slug}`}>
                    <button className="text-secondary hover:text-primary font-medium flex items-center">
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className=" md:hidden flex">
          <Link passHref href={`/Newses`}>
            <button className="px-6 m-auto mt-10  py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
