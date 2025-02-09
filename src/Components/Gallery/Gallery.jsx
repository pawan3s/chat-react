import React, { useState, useEffect, useRef } from "react";
import "./gallery.scss"; // Assuming you have a SASS file for styling
import { useNavigate } from "react-router-dom";

const Gallery = () => {
    const navigate = useNavigate();

    const images = [
        {
          src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXlrdzltbHkwMnlsYXhuczNhOXAydGJnMnFuaGVmc2hpOGxqMXY1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OW8JhCRLHuwNsctz5s/giphy.gif",
          description: "Here is a Small gift for you ❤️, scroll down for more memories ❤️",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1738133054/IMG_0247_jv1r8j.jpg",
          description: "Early days, Look how cute we look ❤️❤️❤️",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1739078725/hami/kezea22mbvhzlrwiu5g5.jpg",
          description: "A memorable vedetar Date❤️",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1738133268/Profile_pictures/IMG_0743_ebozze.jpg",
          description: "Mask guys ! ❤️, Kaileko ho yaad chha?",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1738133427/Profile_pictures/IMG_9812_mbv1gd.jpg",
          description: "And Finally we look like buda budi ❤️",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1739078725/hami/pjpjy16zsyb0zk93rgoe.jpg",
          description: "And forever...",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1739078725/hami/glfslsr8zh6f8cn2cvgd.jpg",
          description: "How sad both of us were...❤️",
        },
        {
          src: "https://res.cloudinary.com/da3akj2d8/image/upload/v1739078725/hami/s3cwaxse4ghoxzwzc5gn.jpg",
          description: "And last one for today....Cheers........❤️",
        },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const { scrollTop, offsetHeight } = galleryRef.current;
        const newIndex = Math.floor(scrollTop / offsetHeight);
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const galleryElement = galleryRef.current;
    if (galleryElement) {
      galleryElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (galleryElement) {
        galleryElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentIndex]);

  const handleClick = () => {
    navigate("/main");

  };

  return (
    <div className="gallery-container" ref={galleryRef}>
      {images.map((image, index) => (
        <div
          className={`gallery-image-wrapper ${
            index === currentIndex ? "active" : ""
          }`}
          key={index}
        >
          <img src={image.src} alt={`Gallery ${index + 1}`} className="gallery-image" />
          <div
            className={`gallery-description ${
              index === currentIndex ? "active" : ""
            }`}
          >
            {image.description}
          </div>
          {index===images.length-1?<button type="submit" className="chat-button" onClick={handleClick}>Chat with him ❤️❤️</button>:""}
          
        </div>
      ))}
    
    </div>
  );
};

export default Gallery;
