import { get, post } from "./base";

export const fetchTemplatesData = (data) => {
  return get("/app/templatesGet", data);
};

export const fetchTemplateFormData = (data) => {
  return get("/app/documentGet", data);
};

export const pdfDownLoad = (data) => {
  return get("/app/pdfDownload", data);
};

export const getDocumentList = (data) => {
  return post("/app/documentListByOrder", data);
};

export const getDraft = (data) => {
  return get("/app/documentFormDraft", data);
};

export const saveDraft = (data) => {
  return post(
    `/app/SaveDocumentInfo?isGeneratePdf=false&fileExtension=.eform2`,
    data
  );
};

export const getNoConformityList = (data) => {
  return get("/app/CheckListNonConformity", data);
};

export const getHistoryList = (data) => {
  return get("/app/CheckListNonConformityHistory", data);
}

export const closeNonConfirmityItems = (data) => {
  return post(`/app/CloseNonConfirmityItems`, data);
};
