const cloudinaryEndPoint: string = import.meta.env.VITE_CLOUDINARY_ENDPOINT;

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  // Add more properties if necessary based on the Cloudinary response
}

export async function uploadFileToCloudinary(file: File): Promise<CloudinaryResponse> {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const imageData = new FormData();
  imageData.append("file", file);
  imageData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  imageData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

  try {
    const response = await fetch(cloudinaryEndPoint, {
      method: "post",
      body: imageData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary.");
    }

    const data: CloudinaryResponse = await response.json();
    console.log("Image upload successful");
    console.log({ data });

    const uploadedImageUrl = await data?.url

    return uploadedImageUrl;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}
