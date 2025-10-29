'use client'
import React, { useState } from 'react'

const useImageUpload = () => {
    const [uploadedImage, setUploadedImage] = useState(null);

    // Only create a local preview. Actual upload happens on Save.
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedImage(reader.result); // data URL for preview
        };
        reader.readAsDataURL(file);
    };

    return { handleImageUpload, uploadedImage, setUploadedImage }
}

export default useImageUpload