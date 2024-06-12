const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/upload`;

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "chat-app-file");

    try {
        const response = await fetch(url, {
            method: 'post',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Upload failed.');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFile;
