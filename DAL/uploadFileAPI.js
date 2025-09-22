import { invokeApi } from "../utils/invokeApi";

export const _uplaod_file_on_s3 = async (data) => {
    const requestObj = {
      path: `api/admin/upload_file`,
      method: "POST",
      headers: {
        "x-sh-auth": localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      },
      postData: data,
    };
    return invokeApi(requestObj);
  };

export const _delete_file_from_s3 = async (data) => {
    const requestObj = {
      path: `api/admin/remove_file`,
      method: "DELETE",
      headers: {
        "x-sh-auth": localStorage.getItem("authToken"),
        // "Content-Type": "multipart/form-data",
      },
      postData: data,
    };
    return invokeApi(requestObj);
  };
