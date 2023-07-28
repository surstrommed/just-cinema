import API from "./api";

export const createCategory = (name: string) =>
  API.post("/manageCategories/createCategory", {
    name,
  });
export const getCategories = () => API.get("/manageCategories/getCategories");
export const getCategoryById = (categoryId: string) =>
  API.get(`/manageCategories/getCategoryById/${categoryId}`);
export const deleteCategory = (categoryId: string) =>
  API.delete(`/manageCategories/deleteCategory/${categoryId}`);
