import { post } from "./base";

export const uploadDocumentForm = (data) => {
  return post(
    "/app/SaveDocumentInfo?isGeneratePdf=true&fileExtension=.eform2",
    data
  );
};
