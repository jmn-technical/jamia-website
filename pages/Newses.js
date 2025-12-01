
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaArrowRight, FaNewspaper } from 'react-icons/fa';
import formatDate from '../functions/formatDate'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
const NewsPage = () => {

    const [newsItems, setnewsItems] = useState([]);
  const getData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {});
      const { data } = await res.json();
      setnewsItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
   

  const categories = ["All", "Achievement", "Event", "Scholarship", "Infrastructure"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative   bg-gradient-to-r from-primary to-primary/80    pt-52 pb-24">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className='mt-10'>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4 mt-4 md:mt-0"> News</h1>
            <p className="text-xl text-white">Stay updated with the latest happenings at Jamia Madeenathunnoor</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${category === 'All' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} border border-gray-200 transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <div key={news.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* News Image */}
              <div className="relative h-56 w-full">
               {news.image &&  <Image
                  src={news?.image}
                  alt={news.title}
               layout='fill'
                  className="object-cover object-top"
                />}
                {/* <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {news.category}
                </div> */}
              </div>
              
              {/* News Content */}
              <div className="p-6">
                <div className="flex items-center text-gray-500 mb-3">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(new Date(news?.publishedAt))}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
                <p className="text-gray-600 mb-5">{news.excerpt}</p>
                <Link href={`/news/${news.slug}`}>
                <button className="text-primary font-medium flex items-center hover:text-secondary">
                  Read More <FaArrowRight className="ml-2" />
                </button></Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <FaNewspaper className="text-3xl text-primary mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Stay Updated</h3>
              </div>
              <p className="text-gray-600">
                Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-r-lg font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
      <Footer/>
    </div>
  );
};

export default NewsPage;