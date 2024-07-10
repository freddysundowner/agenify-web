import React, { useState, useEffect } from "react";

const ImageModal = ({ images, selectedImageIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

    useEffect(() => {
        setCurrentIndex(selectedImageIndex);
    }, [selectedImageIndex]);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white text-2xl"
            >
                &times;
            </button>
            <button
                onClick={prevImage}
                className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 z-10 shadow-lg rounded-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <div className="relative">
                <img
                    src={images[currentIndex]}
                    className="max-h-screen max-w-full object-contain"
                />
            </div>
            <button
                onClick={nextImage}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 z-10 shadow-lg rounded-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ImageModal;
