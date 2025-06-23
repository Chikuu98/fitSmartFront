import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let toastId: any = null;

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    if (["post", "put", "delete"].includes(config.method || "")) {
      toastId = toast.loading("Please wait...");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      ["post", "put", "delete"].includes(response.config.method || "") &&
      !response.data.noToast
    ) {
      if (response.data.success === true) {
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }

    return response;
  },
  (error) => {
    let errorMessage = "Something went wrong";

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.update(toastId, {
          render: "Unauthorized Access",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        localStorage.removeItem("access_token");
        return Promise.reject(error);
      }

      if (error.response?.data) {
        const responseData = error.response.data;
        if (
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage = responseData.errors[0];
        } else if (typeof responseData.message === "string") {
          errorMessage = responseData.message;
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (toastId) {
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
