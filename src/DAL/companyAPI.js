import { invokeApi } from "../utils/invokeApi";

export const _companies_list_api = async (page, limit, search = "", filters = {}) => {
    const params = new URLSearchParams({
        page: page,
        limit: limit,
        search: search || "",
    });
  
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });

    const requestObj = {
        path: `api/admin/companies?${params.toString()}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken") || "",
        },
    };

    return invokeApi(requestObj);
};


export const _company_detail_view_api = async (rowID) => {
    const requestObj = {
        path: `api/organization/companies/${rowID}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _add_company_api = async (data) => {
    const requestObj = {
        path: `api/organization/register_company`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _edit_company_api = async (rowID, data) => {
    const requestObj = {
        path: `api/organization/companies/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};
