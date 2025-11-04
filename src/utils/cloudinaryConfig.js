import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadCloudinary = async (file) => {
  const today = new Date().toISOString().split("T")[0];
  const folderPath = `jobs_storm/${today}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "jobs_storm");
  formData.append("folder", folderPath);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    formData
  );

  return { url: data.secure_url }; // Returns { url: "..." }
};
