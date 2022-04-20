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
  // paginateData,
} = require("../src/controller/requestsController");
const {
  getCategories,
  createCategory,
  deleteCategory,
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
router.get("/users", isAdmin, getAllUsers);
router.post("/user", isAdmin, createUser);
router.get("/users-count", isAuth, getLevelUserCount);
router.get("/teams-count", isAuth, getLevelTeamCount);
router.get("/teams", isAuth, getAllUserWithUsernameTeam);
router.put("/userprocess/:id", isAdmin, updateUserProcessOnRequest);
router.put("/approve/:id", isAdmin, approveRequestAdmin);
router.put("/reject/:id", isAdmin, rejectRequestAdmin);
router.delete("/user/:id_user/level/:level", isAdmin, deleteUserById);
router.put("/user/:id_user", isAdmin, updateUser);

// TEAM
router.get("/requests-team", isTeam, getAllUserProcess);
router.put("/approve-team/:id", isTeam, approveRequestTeam);
router.put("/reject-team/:id", isTeam, rejectRequestTeam);
router.put("/done/:id", isTeam, requestDone);

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
router.post("/categories", isAdmin, createCategory);
router.delete("/categories/:id", isAdmin, deleteCategory);

// UTILS
router.get("/requests/:id", isAuth, getDetailRequestById);
router.get("/requests-reply/:id", isAuth, getRequestWithRequestReply);
router.post("/reply-req/:id", isAuth, upload.single("file"), reply_request);
router.get("/requests-waiting", isAuth, getUserRequestWaiting);
router.get("/requests-process", isAuth, getUserRequestProcess);
router.get("/requests-done", isAuth, getUserRequestDone);
router.get("/request/search", searchData);
// router.get("/request/paginate", paginateData);

module.exports = router;