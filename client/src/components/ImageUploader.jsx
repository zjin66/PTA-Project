import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [image2, setImage2] = useState(null); // Added state for the second image
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 }); // Initial position for draggable image
    const [backgroundSize, setBackgroundSize] = useState({ width: 800, height: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleFileChange2 = (e) => {
        setImage2(e.target.files[0]); // Set state for the second file input
    };

    const handleUpload = async () => {
        if (!image) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5050/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url); // Set the uploaded image URL
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleUpload2 = async () => {
        if (!image2) {
            alert('Please select a file for the second image!');
            return;
        }

        const formData = new FormData();
        formData.append('image', image2); // Use `image2` for the second upload

        try {
            const response = await axios.post('http://localhost:5050/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl2(response.data.url); // Set the uploaded image URL for the second image
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };


    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;

        // Scale the height proportionally based on the fixed width of 500
        const scaledHeight = (800 * naturalHeight) / naturalWidth;

        setBackgroundSize({ width: 800, height: scaledHeight });
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        const { offsetX, offsetY } = e.nativeEvent;
        e.dataTransfer.setData('offsetX', offsetX);
        e.dataTransfer.setData('offsetY', offsetY);
    };

    // Drag End Handler
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
    
        const offsetX = parseInt(e.dataTransfer.getData('offsetX'), 10);
        const offsetY = parseInt(e.dataTransfer.getData('offsetY'), 10);
    
        const container = e.target.getBoundingClientRect(); // Background container dimensions
        const newX = e.clientX - offsetX - container.left + 75; // 75 = draggable image width / 2
        const newY = e.clientY - offsetY - container.top + 75; // 75 = draggable image width / 2
    
        // Ensure the image stays within bounds
        const clampedX = Math.max(0, Math.min(newX, container.width - 75)); // 75 = draggable image width / 2
        const clampedY = Math.max(0, Math.min(newY, container.height - 75)); // 75 = draggable image height / 2
    
        setDragPosition({ x: clampedX, y: clampedY });
    };

    // Prevent default dragover behavior
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <h1>Upload and Display the Images</h1>
            <div style={{ display: 'flex', gap: '50px', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <h2>Target Image</h2>
                    {/* First Image Upload Section */}
                    <div>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                        {imageUrl && (
                            <div style={{ marginTop: '10px' }}>
                                <h2>Uploaded Image 1:</h2>
                                <img src={imageUrl} alt="Uploaded" style={{ width: '300px' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <h2>Environment Image</h2>
                    {/* Second Image Upload Section */}
                    <div>
                        <input type="file" onChange={handleFileChange2} />
                      <button onClick={handleUpload2}>Upload</button>
                        {imageUrl2 && (
                            <div style={{ marginTop: '10px' }}>
                                <h2>Uploaded Image 2:</h2>
                                <img src={imageUrl2} alt="Uploaded" style={{ width: '300px' }} />
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {imageUrl && imageUrl2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <h2>Interactive Image Composition</h2>
                    <div
                        src={imageUrl2}
                        alt="Background"
                        onLoad={handleImageLoad}
                        style={{
                            position: 'relative',
                            width: `${backgroundSize.width}px`,
                            height: `${backgroundSize.height}px`,
                            border: '1px solid black',
                            backgroundImage: `url(${imageUrl2})`,
                            backgroundSize: 'cover',
                            overflow: 'hidden',
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        {/* Draggable First Image */}
                        <img
                            src={imageUrl}
                            alt="Draggable"
                            draggable
                            onDragStart={handleDragStart}
                            style={{
                                width: '150px',
                                height : '150px',
                                position: 'absolute',
                                cursor: 'grab',
                                left: dragPosition.x,
                                top: dragPosition.y,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageUploader;