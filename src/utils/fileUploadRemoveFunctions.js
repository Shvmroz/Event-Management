import { _delete_file_from_s3, _uplaod_file_on_s3 } from "../DAL/uploadFileAPI";

export const uploadFileFunction = async (imageFile) => {
  if (!imageFile) return null;
  if (typeof imageFile === "string") return imageFile;

  const req_data = new FormData();
  req_data.append("file", imageFile);

  // Convert FormData to object for logging
  const obj = Object.fromEntries(req_data.entries());
  console.log(obj, "upload image");

  const uploadResponse = await _uplaod_file_on_s3(req_data);
  if (uploadResponse.code === 200) {
    console.log(uploadResponse, "Image Uploaded");
    return uploadResponse.path;
  } else {
    console.log(uploadResponse.message);
    return null;
  }
};


// ===========================================================================================
export const deleteFileFunction = async (fileToRemove) => {
  if (!fileToRemove) {
    console.log("No file to remove");
    return;
  }

  const payload = {
    file_path: fileToRemove,
  };

  console.log("payload ", payload);

  const response = await _delete_file_from_s3(payload);
  if (response.code === 200) {
    console.log("File removed successfully");
    return response;
  } else {
    console.error("Failed to remove file", response.message);
    return response;
  }
};
