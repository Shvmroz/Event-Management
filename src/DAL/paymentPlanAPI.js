import { invokeApi } from "../utils/invokeApi";

export const _payment_plans_list_api = async (page, limit, search = "", filters = {}) => {
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
      path: `api/payment_plan/admin/payment_plans?${params.toString()}`,
      method: "GET",
      headers: {
        "x-sh-auth": localStorage.getItem("authToken") || "",
      },
    };
  
    return invokeApi(requestObj);
  };
  

export const _add_payment_plan_api = async (data) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _edit_payment_plan_api = async (rowID, data) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

export const _delete_payment_plan_api = async (rowID) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans/${rowID}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};
