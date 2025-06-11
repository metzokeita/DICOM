import React, { useState, useEffect } from 'react';

function App() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/images')
            .then(response => response.json())
            .then(data => setImages(data));
    }, []);

    return (
        <div>
            <h1>Images</h1>
            <ul>
                {images.map(image => (
                    <li key={image}>{image}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;