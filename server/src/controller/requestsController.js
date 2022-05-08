const Requests = require("../../models/request");
const Requests_Detail = require("../../models/request_detail");
const Files = require("../../models/files");
const ReplyRequest = require("../../models/reply_request");
const transporter = require("../../utils/nodemailer");
const { Op } = require("sequelize");

// pagination function
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? +(page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: requests } = data;
  const currentPage = page ? +parseInt(page) : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, requests, totalPages, currentPage };
};

const createRequest = async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const {
    userRequest,
    department,
    category,
    email,
    titleRequest,
    subjekRequest,
  } = req.body;

  const saveToRequest = await Requests.create({
    id_user: req.decoded.id,
    user_request: req.decoded.username,
    category: category,
    email_request: req.decoded.email,
    department: department,
    ticket_status: "W",
    start_process_ticket: null,
    end_date_ticket: null,
  });

  if (!saveToRequest) {
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  const saveToRequest_Detail = await Requests_Detail.create({
    id_requests: saveToRequest.id,
    title_request: titleRequest,
    subjek_request: subjekRequest,
  });

  if (!saveToRequest_Detail) {
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  if (req.files.length > 0) {
    const imageFile = url + "/public/files/" + req.files.image[0].filename;
    const fileDocument =
      url + "/public/files/" + req.files.file_document[0].filename;

    const saveToFiles = await Files.create({
      id_requests: saveToRequest.id,
      image: imageFile,
      file_document: fileDocument,
    });
  }

  let mailOptions = {
    from: userRequest,
    to: process.env.MAIL_DESTINATION,
    subject: `Request baru diterima dari ${userRequest}`,
    html: `
    <h3>Dear team IT,</h3>
    <p>
      System Ticketing Menerima Request dari <b>${userRequest}</b> dan silahkan
      anda login ke Ticketing System untuk memproses request yang masuk,
      terima kasih.
    </p>
    `,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent!");
    }
  });

  res.status(200).json({
    status: "success",
    message: "Successfully create request!",
  });
};

// ADMIN
const getRequests = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  await Requests.findAndCountAll({
    attributes: [
      "id",
      "id_user",
      "user_request",
      "ticket_status",
      "user_process",
      "createdAt",
    ],
    include: [
      {
        model: Requests_Detail,
        attributes: ["title_request"],
      },
      {
        model: Files,
        attributes: ["image", "file_document"],
      },
    ],
    limit,
    offset,
    // Ini untuk merapihkan hasil query
    raw: true,
    nest: true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        status: "success",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

const getAllUserRequest = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  await Requests.findAndCountAll({
    where: { id_user: req.decoded.id },
    attributes: [
      "id",
      "id_user",
      "user_request",
      "ticket_status",
      "user_process",
      "createdAt",
    ],
    include: [
      {
        model: Requests_Detail,
        attributes: ["title_request"],
      },
      {
        model: Files,
        attributes: ["image", "file_document"],
      },
    ],
    limit,
    offset,
    // Ini untuk merapihkan hasil query
    raw: true,
    nest: true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        status: "success",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

const getUserRequestWaiting = async (req, res) => {
  if (req.decoded.level == "team") {
    const requests = await Requests.findAll({
      where: { ticket_status: "W" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else if (req.decoded.level == "admin") {
    const requests = await Requests.findAll({
      where: { ticket_status: "W" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else {
    const requests = await Requests.findAll({
      where: { id_user: req.decoded.id, ticket_status: "W" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  }
};

const getUserRequestProcess = async (req, res) => {
  if (req.decoded.level == "team") {
    const requests = await Requests.findAll({
      where: { user_process: req.decoded.fullname, ticket_status: "P" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else if (req.decoded.level == "admin") {
    const requests = await Requests.findAll({
      where: { ticket_status: "P" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else {
    const requests = await Requests.findAll({
      where: { id_user: req.decoded.id, ticket_status: "P" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  }
};

const getUserRequestDone = async (req, res) => {
  if (req.decoded.level == "team") {
    const requests = await Requests.findAll({
      where: { user_process: req.decoded.fullname, ticket_status: "D" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else if (req.decoded.level == "admin") {
    const requests = await Requests.findAll({
      where: { ticket_status: "D" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  } else {
    const requests = await Requests.findAll({
      where: { id_user: req.decoded.id, ticket_status: "D" },
      attributes: ["id"],
    });

    res.status(200).json({
      status: "success",
      message: "Successfully get requests!",
      data: requests,
    });
  }
};

// get all requests by user process = team
const getAllUserProcess = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  await Requests.findAndCountAll({
    attributes: [
      "id",
      "id_user",
      "user_request",
      "ticket_status",
      "user_process",
      "createdAt",
    ],
    include: [
      {
        model: Requests_Detail,
        attributes: ["title_request"],
      },
      {
        model: Files,
        attributes: ["image", "file_document"],
      },
    ],
    limit,
    offset,
    // Ini untuk merapihkan hasil query
    raw: true,
    nest: true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        status: "success",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

// search requests data
const searchData = async (req, res) => {
  const { search } = req.query;
  let requests;

  if (req.decoded.level == "admin" || req.decoded.level == "team") {
    requests = await Requests.findAll({
      where: {
        [Op.or]: [
          {
            user_request: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            user_process: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Requests_Detail,
          attributes: ["title_request", "subjek_request"],
          // where: {
          //   [Op.or]: [
          //     {
          //       title_request: {
          //         [Op.like]: `%${search}%`,
          //       },
          //     },
          //   ],
          // },
        },
        {
          model: Files,
          attributes: ["image", "file_document"],
        },
      ],
      // Ini untuk merapihkan hasil query
      raw: true,
      nest: true,
    });
  } else {
    requests = await Requests.findAll({
      where: {
        id_user: req.decoded.id,
        [Op.or]: [
          {
            user_process: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Requests_Detail,
          attributes: ["title_request", "subjek_request"],
          // where: {
          //   [Op.or]: [
          //     {
          //       title_request: {
          //         [Op.like]: `%${search}%`,
          //       },
          //     },
          //   ],
          // },
        },
        {
          model: Files,
          attributes: ["image", "file_document"],
        },
      ],
      // Ini untuk merapihkan hasil query
      raw: true,
      nest: true,
    });
  }

  if (!requests) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully get requests!",
    data: requests,
  });
};

const getDetailRequestById = async (req, res) => {
  const requests = await Requests.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Requests_Detail,
        attributes: ["id", "title_request", "subjek_request"],
      },
      {
        model: Files,
        attributes: ["image", "file_document"],
      },
    ],
    // Ini untuk merapihkan hasil query
    raw: true,
    nest: true,
  });

  if (!requests) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully get requests!",
    data: requests,
  });
};

const getRequestWithRequestReply = async (req, res) => {
  const requests = await Requests.findAll({
    attributes: ["id"],
    where: { id: req.params.id },
    include: [
      {
        model: Requests_Detail,
        attributes: ["id", "subjek_request"],
      },
      {
        model: ReplyRequest,
        attributes: ["id", "message", "user_reply", "createdAt"],
        include: [{ model: Files, attributes: ["file_document"] }],
      },
    ],
    // Ini untuk merapihkan hasil query
    raw: true,
    nest: true,
  });

  if (!requests) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully get requests!",
    data: requests,
  });
};

const updateUserProcessOnRequest = async (req, res) => {
  const { user_process } = req.body;
  const { id } = req.params;

  console.log(user_process);

  const updateUserProcess = await Requests.update(
    { user_process: user_process },
    { where: { id: id } }
  );

  if (!updateUserProcess) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully update user process!",
  });
};

const approveRequestAdmin = async (req, res) => {
  const { id } = req.params;

  const updateStatus = await Requests.update(
    { ticket_status: "P" },
    { where: { id: id } }
  );

  if (!updateStatus) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully update status!",
  });
};

const rejectRequestAdmin = async (req, res) => {
  const { id } = req.params;

  const updateUserProcess = await Requests.update(
    { ticket_status: "R" },
    { where: { id: id } }
  );

  if (!updateUserProcess) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully reject request!",
  });
};

const approveRequestTeam = async (req, res) => {
  const { id } = req.params;

  const updateStatus = await Requests.update(
    { ticket_status: "P", user_process: req.decoded.fullname },
    { where: { id: id } }
  );

  if (!updateStatus) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully update status!",
  });
};

const rejectRequestTeam = async (req, res) => {
  const { id } = req.params;

  const updateUserProcess = await Requests.update(
    { ticket_status: "R" },
    { where: { id: id } }
  );

  if (!updateUserProcess) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully reject request!",
  });
};

const reply_request = async (req, res) => {
  const { id } = req.params;
  const { message_reply } = req.body;
  const url = req.protocol + "://" + req.get("host");

  const reply = await ReplyRequest.create({
    id_request: id,
    message: message_reply,
    user_reply: req.decoded.fullname || req.decoded.username,
  });

  if (!reply) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  if (req.file) {
    const fileName = url + "/public/files/" + req.file.filename;
    await Files.create({
      id_requests: id,
      id_reply: reply.id,
      file_document: fileName,
    });
  }

  const findRequest = await Requests.findOne({
    attributes: ["user_request", "email_request"],
    where: { id: id },
  });

  if (req.decoded.level == "team") {
    let mailOptions = {
      from: req.decoded.email,
      to: findRequest.email_request,
      subject: `Balasan request ${id} dari ${req.decoded.fullname}`,
      html: `
      <h3>Kepada Bapak/Ibu ${findRequest.user_request}, </h3>
      <p>
        Anda mendapatkan balasan dari request <b>${id}</b> dari <b>${req.decoded.fullname}</b> dan silahkan anda login ke aplikasi untuk membalas kembali request anda.
      </p>
      `,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent!");
      }
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully reply request!",
    data: reply,
  });
};

const requestDone = async (req, res) => {
  const { id } = req.params;

  const updateStatus = await Requests.update(
    { ticket_status: "D" },
    { where: { id: id } }
  );

  if (!updateStatus) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully update status!",
  });
};

module.exports = {
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
};
