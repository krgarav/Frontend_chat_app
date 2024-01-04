import React, { createContext, useContext, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null);

  const showSuccessToast = (message) => {
    setToastMessage(message);
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER
      });
  };

  const showWarningToast = (message)=>{
    toast.warning(message, {
      position: toast.POSITION.TOP_CENTER
    });
  }
  const hideToast = () => {
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider value={{ showWarningToast, showSuccessToast, hideToast }}>
      {children}
      <ToastContainer />
      {/* {toastMessage && <div>{toastMessage}</div>} */}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
