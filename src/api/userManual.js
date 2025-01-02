import { get } from "./base";

export const getUserManual = () => {
  return get("/app/userInstruction");
};

export const downLoadPdf = (id) => {
  return get("/app/userInstruction/download", { id });
};
