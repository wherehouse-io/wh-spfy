import { logger } from "../logger";

let requestId: string | null = null;

export const setRequestId = (id: string) => {
  logger.info(`--set-request-id-----${JSON.stringify(id)}`);
  requestId = id;
};

export const getRequestId = () => {
  logger.info(`--get-request-id-----${JSON.stringify(requestId)}`);
  return requestId || "-";
};
