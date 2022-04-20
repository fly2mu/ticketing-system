import api from "./index";

export const createCategory = (data) => {
  return api.post("/categories", data);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
