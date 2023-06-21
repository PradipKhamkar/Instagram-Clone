import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const successToast = (message) => toast.success(message, options);

export const errorToast = (message) => toast.error(message, options);

export const loadingToast = (message, loading) =>
  toast.loading(message, { ...options, close: false });

export const promiseToast = (promise) =>
  toast.promise(promise, {
    pending: "Promise is pending",
    success: "Promise resolved 👌",
    error: "Promise rejected 🤯",
  });
