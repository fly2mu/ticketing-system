import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEllipsisH,
  faEye,
  faTrashAlt,
  faCheckCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import {
  Breadcrumb,
  Card,
  Table,
  Dropdown,
  ButtonGroup,
  Button,
  // Modal,
  // Form,
} from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAllRequestWithUserProccess,
  rejectRequestTeam,
  approveRequestTeam,
  // replyMessageTeam,
  requestDone,
} from "../../api/requestApi";
import { Routes } from "../../routes";

export default () => {
  const [listRequest, setListRequest] = useState([]);
  // const [showDefaultModalReply, setShowDefaultModalReply] = useState(false);
  // const handleCloseModalReply = () => setShowDefaultModalReply(false);
  const history = useHistory();
  // const [reply, setReply] = useState("");
  // const [idDetailReq, setIdDetailReq] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const getRequest = await getAllRequestWithUserProccess();
        setListRequest(getRequest.data.data);
      } catch (error) {
        toast.warning("Unauthorized Access!!!");
        history.push("/");
        localStorage.clear();
        console.log(error);
      }
    })();
  }, [history]);

  const handleDoneRequest = async (id) => {
    try {
      await requestDone(id);

      listRequest.map((item) => {
        if (item.id === id) {
          item.ticket_status = "D";
        }
        return item;
      });
      toast.success("Successfully request done!");
      history.push(Routes.UserRequestTeam.path);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    const approveRequest = await approveRequestTeam(
      id,
      localStorage.getItem("fullname")
    );
    if (!approveRequest) {
      return toast.error("Something went wrong!");
    }
    listRequest.map((item) => {
      if (item.id === id) {
        item.ticket_status = "P";
        item.user_process = localStorage.getItem("fullname");
      }
      return item;
    });
    history.push(Routes.UserRequestTeam.path);
    toast.success("Successfully approve request!");
  };

  const handleReject = async (id) => {
    const rejectRequest = await rejectRequestTeam(id);
    if (!rejectRequest) {
      return toast.error("Something went wrong!");
    }
    listRequest.map((item) => {
      if (item.id === id) {
        item.ticket_status = "R";
      }
      return item;
    });
    history.push(Routes.UserRequestTeam.path);
    toast.success("Successfully reject request!");
  };

  // const sendReply = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const replyRequest = await replyMessageTeam(idDetailReq, reply);
  //     if (!replyRequest) {
  //       return toast.error("Failed to send message reply!");
  //     }

  //     setReply("");
  //     setShowDefaultModalReply(false);
  //     history.push("/team/requests");
  //     toast.success("Successfully send message reply!");
  //   } catch (error) {
  //     toast.error("Failed to send message reply!!");
  //     console.log(error);
  //   }
  // };

  const requestLists = listRequest.map((request) => {
    let statusVariant = "";
    let statusText = "";

    if (request.ticket_status === "W") {
      statusVariant = "warning";
      statusText = "Waiting";
    } else if (request.ticket_status === "P") {
      statusVariant = "info";
      statusText = "ON Progress";
    } else if (request.ticket_status === "D") {
      statusVariant = "success";
      statusText = "Done";
    } else {
      statusVariant = "danger";
      statusText = "Rejected";
    }

    const changeDate = moment(request.createdAt)
      .month(1)
      .format("DD-MM-YYYY HH:mm");

    return (
      <>
        <tr key={request.id}>
          <td>{request.id}</td>
          <td>
            <span className="fw-normal">{request.user_request}</span>
          </td>
          <td>
            <span className="fw-normal">{changeDate}</span>
          </td>
          <td>
            <span className="fw-normal">
              {request.requests_detail.title_request}
            </span>
          </td>
          <td>
            <span className="fw-normal">{request.user_process}</span>
          </td>
          <td>
            <span className={`fw-normal text-${statusVariant}`}>
              {statusText}
            </span>
          </td>
          <td>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                as={Button}
                split
                variant="link"
                className="text-dark m-0 p-0"
              >
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-20">
                <Dropdown.Item
                  onClick={() => {
                    history.push(
                      `/ticketing/request/chat/${request.id}/status/${statusText}`
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="me-2" /> Details
                </Dropdown.Item>

                {request.ticket_status === "P" ? (
                  <Dropdown.Item
                    onClick={() => {
                      handleDoneRequest(request.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />{" "}
                    Done
                  </Dropdown.Item>
                ) : null}

                {request.ticket_status === "W" ? (
                  <Dropdown.Item
                    onClick={() => {
                      // setShowDefaultModalReply(true);
                      // setIdDetailReq(request.requests_detail.id);
                      handleApprove(request.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" /> Approve
                  </Dropdown.Item>
                ) : null}

                {request.ticket_status === "D" ? (
                  ""
                ) : (
                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => {
                      handleReject(request.id);
                      // setShowDefaultModalReply(true);
                      // setIdDetailReq(request.requests_detail.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="me-2" />{" "}
                    Reject
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>User Requests</Breadcrumb.Item>
            <Breadcrumb.Item active>List Requests</Breadcrumb.Item>
          </Breadcrumb>
          <h4>List Requests</h4>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        className="mb-3"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>

      <Card
        border="light"
        className="table-wrapper table-responsive shadow-sm w-100"
      >
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">ID Request</th>
                <th className="border-bottom">User request</th>
                <th className="border-bottom">Date request</th>
                <th className="border-bottom">Title request</th>
                <th className="border-bottom">User process</th>
                <th className="border-bottom">Status request</th>
                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            <tbody>{requestLists}</tbody>
          </Table>
          {/* <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
            <Nav>
              <Pagination className="mb-2 mb-lg-0">
                <Pagination.Prev>Previous</Pagination.Prev>
                <Pagination.Item active>1</Pagination.Item>
                <Pagination.Item>2</Pagination.Item>
                <Pagination.Item>3</Pagination.Item>
                <Pagination.Item>4</Pagination.Item>
                <Pagination.Item>5</Pagination.Item>
                <Pagination.Next>Next</Pagination.Next>
              </Pagination>
            </Nav>
            <small className="fw-bold">
              Showing <b>{totalTransactions}</b> out of <b>25</b> entries
            </small>
          </Card.Footer> */}
        </Card.Body>
      </Card>

      {/* Modal for reply message request */}
      {/* <Modal
        as={Modal.Dialog}
        centered
        show={showDefaultModalReply}
        onHide={handleCloseModalReply}
      >
        <Modal.Header>
          <Modal.Title className="h6">Message Reply</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={handleCloseModalReply}
          />
        </Modal.Header>
        <Form onSubmit={(e) => sendReply(e)}>
          <Modal.Body>
            <Form.Group controlId="subjekRequest" className="mb-3">
              <Form.Label>Message reply</Form.Label>
              <Form.Control
                as="textarea"
                rows="5"
                id="subjekRequest"
                required
                placeholder="Masukan pesan anda"
                onChange={(e) => setReply(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="link"
              className="text-gray ms-auto"
              onClick={handleCloseModalReply}
            >
              Close
            </Button>
            <Button
              variant="secondary"
              type="submit"
              onClick={handleCloseModalReply}
            >
              Reply
            </Button>
          </Modal.Footer>
        </Form>
      </Modal> */}
    </>
  );
};
