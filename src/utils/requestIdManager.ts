let requestId: string | null = null;

export const setRequestId = (id: string) => {
  requestId = id;
};

export const getRequestId = () => {
  return requestId || "-"; 
};