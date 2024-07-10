import React, { useRef, useState, useEffect } from "react";
import ImageModal from "./ImageModal";  // Import the ImageModal component

const ImageSlider = ({ images }) => {
    const galleryRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const checkScrollPosition = () => {
        const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
        setIsAtStart(scrollLeft === 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    useEffect(() => {
        const galleryElement = galleryRef.current;
        galleryElement.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition();

        return () => {
            galleryElement.removeEventListener("scroll", checkScrollPosition);
        };
    }, []);

    const scrollLeft = () => {
        galleryRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        galleryRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="relative">
            {!isAtStart && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-2 z-10 shadow-lg rounded-full"
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
            )}
            <div
                ref={galleryRef}
                className="flex overflow-x-auto space-x-4 px-8 scrollbar-hide"
            >
                {images?.map((image, index) => (
                    <div key={index} className="flex-shrink-0 animate-fadeIn">
                        <img
                            src={image}
                            className="h-80 object-cover w-96 rounded-lg shadow-md cursor-pointer"
                            onClick={() => openModal(index)}  // Add click handler to open modal
                        />
                    </div>
                ))}
            </div>
            {!isAtEnd && (
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-2 z-10 shadow-lg rounded-full"
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
            )}
            {isModalOpen && (
                <ImageModal
                    images={images}
                    selectedImageIndex={selectedImageIndex}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default ImageSlider;
