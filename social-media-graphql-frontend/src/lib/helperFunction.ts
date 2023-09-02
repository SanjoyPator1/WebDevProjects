import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
  isToday,
  isYesterday,
} from "date-fns";

const cloudinaryEndPoint: string = import.meta.env.VITE_CLOUDINARY_ENDPOINT;

interface CloudinaryResponse {
  url: any;
  public_id: string;
  secure_url: string;
}

export async function uploadFileToCloudinary(
  file: File
): Promise<CloudinaryResponse> {
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

// Calculate the time difference between now and the given time - for items like posts
export const timeDifference = (givenTime: string) => {
  const currentTime = new Date();
  const postTime = new Date(givenTime);

  const minutesDiff = differenceInMinutes(currentTime, postTime);
  const hoursDiff = differenceInHours(currentTime, postTime);
  const daysDiff = differenceInDays(currentTime, postTime);
  const weeksDiff = differenceInWeeks(currentTime, postTime);
  const monthsDiff = differenceInMonths(currentTime, postTime);
  const yearsDiff = differenceInYears(currentTime, postTime);

  if (yearsDiff >= 1) {
    // If more than or equal to 1 year, show in years
    return `${yearsDiff} ${yearsDiff === 1 ? "year" : "years"} ago`;
  } else if (monthsDiff >= 1) {
    // If more than or equal to 1 month, show in months
    return `${monthsDiff} ${monthsDiff === 1 ? "month" : "months"} ago`;
  } else if (weeksDiff >= 1) {
    // If more than or equal to 1 week, show in weeks
    return `${weeksDiff} ${weeksDiff === 1 ? "week" : "weeks"} ago`;
  } else if (daysDiff >= 1) {
    // If more than or equal to 1 day, show in days
    return `${daysDiff} ${daysDiff === 1 ? "day" : "days"} ago`;
  } else if (hoursDiff >= 1) {
    // If less than 1 day but more than or equal to 1 hour, show in hours
    return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
  } else {
    // If less than 1 hour, show in minutes
    return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
  }
};

/**
 * Format a message date based on whether it's today, yesterday, or before yesterday.
 *
 * @param date - The date to format.
 * @returns A formatted date string.
 */
export function formatMessageDateForDisplay(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "dd MMM yy - h:mm a");
  }
}

export function getInitials(name: string): string {
  const words = name.split(" ");
  let initials = "";

  for (const word of words) {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }

  return initials;
}

export const createSignal = <T>(initialValue: T) => {
  let value: T = initialValue;

  return {
    getValue: () => value,
    setValue: (val: T) => (value = val),
  };
};
