import api from "./index";

// ADMIN
export const getAllRequest = () => {
  return api.get("/requests-admin");
};

// TEAM
export const getAllRequestWithUserProccess = () => {
  return api.get("/requests-team");
};

export const requestDone = (id) => {
  return api.put(`/done/${id}`);
};

// USER
export const getAllUserRequest = () => {
  return api.get("/requests");
};

export const addRequest = (request) => {
  return api.post("/requests", request, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UTILS
export const getDetailRequest = (id) => {
  return api.get(`/requests/${id}`);
};

export const getCategories = () => {
  return api.get("/categories");
};

export const updateUserProcess = (user_process, id) => {
  return api.put(`/userprocess/${id}`, { user_process: user_process });
};

export const rejectRequestAdmin = (id) => {
  return api.put(`/reject/${id}`);
};

export const approveRequestTeam = (id, user_process) => {
  return api.put(`/approve-team/${id}`, { user_process: user_process });
};

export const rejectRequestTeam = (id) => {
  return api.put(`/reject-team/${id}`);
};

export const replyMessageTeam = (id, message) => {
  return api.post(`/reply-req/${id}`, message, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getRequestWithReply = (id) => {
  return api.get(`/requests-reply/${id}`);
};

export const getRequestWaiting = () => {
  return api.get("/requests-waiting");
};

export const getRequestProcess = () => {
  return api.get("/requests-process");
};

export const getRequestDone = () => {
  return api.get("/requests-done");
};
