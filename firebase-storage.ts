import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export interface GalleryImage {
    url: string;
    filename: string;
    uploadedAt: string;
}

export const storageService = {
    /**
     * Upload an image to Firebase Storage
     * @param file - The image file to upload
     * @returns Promise with the download URL
     */
    uploadGalleryImage: async (file: File): Promise<string> => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const imageRef = storageRef(storage, `gallery/${filename}`);

        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL;
    },

    /**
     * Delete an image from Firebase Storage
     * @param imageUrl - The full download URL of the image
     */
    deleteGalleryImage: async (imageUrl: string): Promise<void> => {
        try {
            // Extract the file path from the URL
            const decodedUrl = decodeURIComponent(imageUrl);
            const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);

            if (pathMatch && pathMatch[1]) {
                const filePath = pathMatch[1];
                const imageRef = storageRef(storage, filePath);
                await deleteObject(imageRef);
            } else {
                throw new Error('Invalid image URL format');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    },

    /**
     * List all gallery images from Firebase Storage
     * @returns Promise with array of image URLs
     */
    listGalleryImages: async (): Promise<string[]> => {
        const galleryRef = storageRef(storage, 'gallery/');
        const result = await listAll(galleryRef);

        const urlPromises = result.items.map(item => getDownloadURL(item));
        const urls = await Promise.all(urlPromises);

        return urls;
    }
};

export default storageService;
