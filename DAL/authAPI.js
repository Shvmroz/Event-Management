import { invokeApi } from "../utils/invokeApi";


export const _login_api = async (data) => {
    const requestObj = {
        path: `api/admin/login`,
        method: "POST",
        postData: data,
    };
    return invokeApi(requestObj);
};
export const _logout_api = async (data) => {
    const requestObj = {
        path: `api/admin/logout`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};
export const _change_password_api = async (data) => {
    const requestObj = {
        path: `api/admin/change_password`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};
export const _update_admin_profile_api = async (data) => {
    const requestObj = {
        path: `api/admin/profile`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

