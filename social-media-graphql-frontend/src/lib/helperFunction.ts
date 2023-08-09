import { differenceInHours, differenceInMinutes, format } from "date-fns";

const cloudinaryEndPoint: string = import.meta.env.VITE_CLOUDINARY_ENDPOINT;

interface CloudinaryResponse {
  url: any;
  public_id: string;
  secure_url: string;
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

    return data;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}

// Calculate the time difference between now and the given time
export  const timeDifference = (givenTime: string) => {
  const currentTime = new Date();
  const postTime = new Date(givenTime);

  const minutesDiff = differenceInMinutes(currentTime, postTime);
  const hoursDiff = differenceInHours(currentTime, postTime);

  if (hoursDiff >= 24) {
    // If more than or equal to 24 hours, show the date in "14 March 2023" format
    return format(postTime, "dd MMMM yyyy");
  } else if (hoursDiff >= 1) {
    // If less than 24 hours but more than or equal to 1 hour, show hours ago
    return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
  } else {
    // If less than 1 hour, show minutes ago
    return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
  }
};

export function getInitials(name: string): string {
  const words = name.split(' ');
  let initials = '';

  for (const word of words) {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }

  return initials;
}

export const createSignal = <T>(initialValue: T) => {
  let value:T = initialValue;

  return {
    getValue: () => value,
    setValue: (val: T) => value = val,
  }
}