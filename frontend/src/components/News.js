import React, { useState, useEffect } from "react";
import "./News.css";

const newsData = [
  {
    title: "Building viable economic activities around agroecology",
    desc: "A range of creative approaches adopted by young entrepreneurs...",
    img: "https://scontent.fbho4-4.fna.fbcdn.net/v/t39.30808-6/524573053_1993582194719784_5358425096252327261_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=UkGtVjH2HFYQ7kNvwF_3aHw&_nc_oc=AdpVCKp5ZbhT71MUC-P6JZfoISAskXUa75RrgX7tP-m4e9nVC7N8q5EhJAXyQ36cmU9jmZ2qFQtyNvFSRsk59_25&_nc_zt=23&_nc_ht=scontent.fbho4-4.fna&_nc_gid=XdWwPDKJ7i5jN3Vy6z_enQ&_nc_ss=7a389&oh=00_Af1sFMaW-nlD-1xwxxcDDezuD6cFVvOjuZK3QAkamOrEFA&oe=69E40583"
  },
  {
    title: "Pivotal role of young entrepreneurs",
    desc: "Key agri-food stakeholders participating in workshops...",
    img: "https://massentrepreneurship.org/wp-content/uploads/2023/08/ease-of-doing-business-aug-23.webp"
  },
  {
    title: "Sharing ups and downs of entrepreneurship",
    desc: "Young leaders said they felt more confident...",
    img: "https://triumphias.com/blog/wp-content/uploads/2025/07/Women-Employment-in-India-2025-07-30T124400.077.png"
  },
  {
    title: "New Irrigation Methods",
    desc: "Modern irrigation techniques helping farmers...",
    img: "https://automatworld.in/india/public/admin/assets/images/automat/Blog_thumbnail/1718111962-20-march-24.jpg"
  },
  {
    title: "Organic Farming Growth",
    desc: "Organic farming demand is increasing rapidly...",
    img: "https://mitraweb.in/blogs/wp-content/uploads/2024/07/Organic-Farming-Landscape-1024x1024.jpg"
  },
  {
    title: "Crop Monitoring AI",
    desc: "AI tools helping monitor crop health...",
    img: "https://static.startuptalky.com/2025/06/top-ai-powered-projects-indian-agriculture-startuptalky.jpg"
  }
];

function News() {
  const [index, setIndex] = useState(0);

  const visibleCards = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + visibleCards >= newsData.length ? 0 : prev + visibleCards
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) =>
      prev + visibleCards >= newsData.length ? 0 : prev + visibleCards
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev - visibleCards < 0
        ? newsData.length - visibleCards
        : prev - visibleCards
    );
  };

  return (
    <section className="news">
      <h2>Latest News</h2>

      <div className="slider">
        <button className="btn prev" onClick={prev}>❮</button>

        <div className="news-container">
          {newsData.slice(index, index + visibleCards).map((item, i) => (
            <div className="card" key={i}>
              <img src={item.img} alt="" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <a href="#">Read More</a>
            </div>
          ))}
        </div>

        <button className="btn next" onClick={next}>❯</button>
      </div>
    </section>
  );
}

export default News;