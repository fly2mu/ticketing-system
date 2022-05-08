import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import {
  Breadcrumb,
  Card,
  Table,
  Button,
  Form,
  Pagination,
  Nav,
  Row,
  Col,
  Spinner,
} from "@themesberg/react-bootstrap";

import { getAllUserRequest, searchRequest } from "../../api/requestApi";
import { useHistory } from "react-router-dom";

export default () => {
  const [listRequest, setListRequest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  let statusVariant = "";
  let statusText = "";

  useEffect(() => {
    (async () => {
      const getRequest = await getAllUserRequest();
      setListRequest(getRequest.data.data.requests);
      setTotalPage(getRequest.data.data.totalPages);
    })();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const search = await searchRequest(keyword);
    setListRequest(search.data.data);
    setKeyword("");
    setIsPending(false);
  };

  const previousPage = async () => {
    setCurrentPage((current) => current - 1);
    if (currentPage <= 1) {
      setCurrentPage(1);
    }
    const getRequest = await getAllUserRequest({ page: currentPage, size: 10 });
    setListRequest(getRequest.data.data.requests);
  };

  const nextPage = async () => {
    setCurrentPage((current) => current + 1);
    if (currentPage >= totalPage) {
      setCurrentPage(1);
    }
    const getRequest = await getAllUserRequest({ page: currentPage, size: 10 });
    setListRequest(getRequest.data.data.requests);
  };

  const requestLists = listRequest.map((request) => {
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
            <span className="fw-normal">
              {/* create badge button */}
              <Button
                variant="info"
                className="m-1"
                size="sm"
                onClick={() =>
                  history.push(
                    `/ticketing/request/chat/${request.id}/status/${statusText}`
                  )
                }
              >
                detail
              </Button>
            </span>
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      {/* <Button
        className="btn btn-primary"
        onClick={() => console.log(singelRequest)}
      >
        TEST
      </Button> */}
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>List Requests</Breadcrumb.Item>
          </Breadcrumb>
          <h4>List Requests</h4>
        </div>
      </div>

      <Row className="wrapper justify-between">
        <Col>
          <Button
            variant="primary"
            size="sm"
            className="mb-3"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Col>

        <Col>
          <Form
            onSubmit={(e) => handleSearch(e)}
            style={{
              display: "flex",
              justifyContent: "between",
              alignItems: "center",
            }}
          >
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              style={{ marginRight: "10px" }}
            />

            {isPending ? (
              <Button variant="primary" type="submit" disabled>
                <Spinner animation="border" size="sm" role="status" />
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            )}
          </Form>
        </Col>
      </Row>

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
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
          <Card.Footer className="px-1 border-0 d-lg-flex align-items-center justify-content-between">
            <Nav>
              <Pagination className="mb-2 mb-lg-0">
                <Button
                  className="me-3"
                  variant="primary"
                  onClick={() => previousPage()}
                >
                  Previous
                </Button>
                <Button variant="primary" onClick={() => nextPage()}>
                  Next
                </Button>
              </Pagination>
            </Nav>
          </Card.Footer>
        </Card.Body>
      </Card>
    </>
  );
};
