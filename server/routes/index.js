const router = require("express").Router();
const {
  // loginAdmin,
  loginUser,
  getAllUsers,
  getAllUserWithUsernameTeam,
  getLevelUserCount,
  getLevelTeamCount,
  getAllUserAdmin,
  createUser,
  deleteUserById,
  updateUser,
  searchUser,
  getAllUserHead,
  getEmployee,
  // searchUserAdmin,
} = require("../src/controller/userController");
const {
  createRequest,
  getRequests,
  getAllUserRequest,
  getAllUserProcess,
  updateUserProcessOnRequest,
  approveRequestAdmin,
  rejectRequestAdmin,
  approveRequestTeam,
  rejectRequestTeam,
  getDetailRequestById,
  getRequestWithRequestReply,
  reply_request,
  getUserRequestWaiting,
  getUserRequestProcess,
  getUserRequestDone,
  requestDone,
  searchData,
  filterDataByDate,
  getRequestsHead,
} = require("../src/controller/requestsController");
const {
  getCategories,
  createCategory,
  deleteCategory,
  searchCategory,
} = require("../src/controller/categoryController");
const { isAuth, isAdmin, isTeam } = require("../src/middleware/isAuth");
const multer = require("multer");
const uuid = require("uuid");

const DIR = "./public/files/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid.v4() + "-" + fileName);
  },
});

let upload = multer({
  storage: storage,
});

// ADMIN
// router.post("/login-admin", loginAdmin);
router.get("/requests-admin", isAdmin, getRequests);
router.get("/admins", isAdmin, getAllUserAdmin);
router.get("/heads", isAdmin, getAllUserHead);
router.get("/users", isAdmin, getAllUsers);
router.get("/employees", isAdmin, getEmployee);
router.post("/user", isAdmin, createUser);
router.get("/users-count", isAuth, getLevelUserCount);
router.get("/teams-count", isAuth, getLevelTeamCount);
router.get("/teams", isAuth, getAllUserWithUsernameTeam);
router.put("/userprocess/:id", isAdmin, updateUserProcessOnRequest);
router.put("/approve/:id", isAdmin, approveRequestAdmin);
router.put("/reject/:id", isAdmin, rejectRequestAdmin);
router.delete("/user/:id_user/level/:level", isAdmin, deleteUserById);
router.put("/user/:id_user", isAdmin, updateUser);
router.get("/users/search", isAdmin, searchUser);
// router.get("/users-admin/search", isAdmin, searchUserAdmin);

// HEAD
router.get("/requests-head", isAdmin, getRequestsHead);

// TEAM
router.get("/requests-team", isTeam, getAllUserProcess);
router.put("/approve-team/:id", isTeam, approveRequestTeam);
router.put("/reject-team/:id", isTeam, rejectRequestTeam);
router.put("/done/:id", isTeam, requestDone);
router.post("/request/filter-date", filterDataByDate);

// USER
router.post("/login", loginUser);
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file_document", maxCount: 1 },
]);
router.post("/requests", isAuth, cpUpload, createRequest);
router.get("/requests", isAuth, getAllUserRequest);

// CATEGORY
router.get("/categories", isAuth, getCategories);
router.get("/categories/search", isAuth, searchCategory);
router.post("/categories", isAdmin, createCategory);
router.delete("/categories/:id", isAdmin, deleteCategory);

// UTILS
router.get("/requests/:id", isAuth, getDetailRequestById);
router.get("/requests-reply/:id", isAuth, getRequestWithRequestReply);
router.post("/reply-req/:id", isAuth, upload.single("file"), reply_request);
router.get("/requests-waiting", isAuth, getUserRequestWaiting);
router.get("/requests-process", isAuth, getUserRequestProcess);
router.get("/requests-done", isAuth, getUserRequestDone);
router.get("/request/search", isAuth, searchData);
// router.get("/request/paginate", paginateData);

module.exports = router;
