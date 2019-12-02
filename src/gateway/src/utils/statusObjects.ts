export const requestError = (error: string): any => {
  return {
    status: "error",
    error
  };
};

export const requestSuccess = (message: string): any => {
  return {
    status: "OK",
    message
  };
};
