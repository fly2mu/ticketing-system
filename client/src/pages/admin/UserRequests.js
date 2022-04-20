import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import {
  Breadcrumb,
  Card,
  Table,
  Dropdown,
  ButtonGroup,
  Button,
} from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Routes } from "../../routes";

import { getAllRequest, rejectRequestAdmin } from "../../api/requestApi";

export default () => {
  const [listRequest, setListRequest] = useState([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const getRequest = await getAllRequest();
        setListRequest(getRequest.data.data);
      } catch (error) {
        toast.warning("Unauthorized Access!!!");
        history.push("/");
        localStorage.clear();
        console.log(error);
      }
    })();
  }, [history]);

  const handleReject = async (id) => {
    const rejectRequest = await rejectRequestAdmin(id);
    if (!rejectRequest) {
      return toast.error("Something went wrong!");
    }
    listRequest.map((item) => {
      if (item.id === id) {
        item.ticket_status = "R";
      }
      return item;
    });
    history.push(Routes.UserRequests.path);
    toast.success("Successfully reject request!");
  };

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
                    history.push(`/ticketing/detail-request/${request.id}`);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="me-2" /> Details
                </Dropdown.Item>

                {/* <Dropdown.Item>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />{" "}
                  Approve
                </Dropdown.Item> */}
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => handleReject(request.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Reject
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      </>
    );
  });

  console.log(requestLists);

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
    </>
  );
};
