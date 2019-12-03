export const statusOk = (message: string, data?: any) => {
  return {
    status: "OK",
    message,
    data
  };
};

export const statusError = (message: string, err?: any) => {
  return {
    status: "error",
    error: message,
    err
  };
};
