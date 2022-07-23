import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Card, Form, Button } from "@themesberg/react-bootstrap";
import {
  getDetailRequest,
  updateUserProcess,
  requestDone,
} from "../../api/requestApi";
import { getAllUserTeam } from "../../api/userApi";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { Routes } from "../../routes";

export default function DetailRequest() {
  const { id } = useParams();
  const history = useHistory();
  const [detailRequest, setDetailRequest] = useState([]);
  const [teams, setTeams] = useState([]);
  let statusVariant = "";
  let statusText = "";
  const level = localStorage.getItem("level");

  useEffect(() => {
    (async () => {
      try {
        const getDetail = await getDetailRequest(id);
        const getUserTeam = await getAllUserTeam();
        setDetailRequest([getDetail.data.data]);
        setTeams(getUserTeam.data.data);
      } catch (error) {
        toast.warning("Something went wrong when fetching request data :(");
        window.history.back();
        console.log(error);
      }
    })();
  }, [id]);

  const handleChangeUserProcess = async (e, id) => {
    try {
      detailRequest.map((item) => {
        if (item.id === id) {
          item.user_process = e.target.value;
        }
        return item;
      });
      // singelRequest.user_process = e.target.value;
      await updateUserProcess(e.target.value, id);

      toast.success("Successfully choose user process!");
      history.push(`/ticketing/detail-request/${id}`);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleDoneRequest = async (id) => {
    try {
      await requestDone(id);

      detailRequest.map((item) => {
        if (item.id === id) {
          item.ticket_status = "D";
        }
        return item;
      });
      toast.success("Successfully request done!");
      history.push(`/ticketing/detail-request/${id}`);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <div className="mt-3">
      <Card border="light" className="shadow-sm p-3">
        {detailRequest.map((data) => {
          if (data.ticket_status === "W") {
            statusVariant = "warning";
            statusText = "Waiting";
          } else if (data.ticket_status === "P") {
            statusVariant = "info";
            statusText = "ON Progress";
          } else if (data.ticket_status === "D") {
            statusVariant = "success";
            statusText = "Done";
          } else {
            statusVariant = "danger";
            statusText = "Rejected";
          }

          return (
            <div key={data.id}>
              <p className="display-4">{data.requests_detail.title_request}</p>
              <div className="d-flex">
                <ul className="me-5">
                  <li className="py-2 fs-5">
                    ID Request: <b>{data.id}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Title Request: <b>{data.requests_detail.title_request}</b>
                  </li>
                  <li className="py-2 fs-5">
                    User Request: <b>{data.user_request}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Category Request: <b>{data.category}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Email Request: <b>{data.email_request}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Department: <b>{data.department}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Create Date Request:{" "}
                    <b>
                      {moment(data.createdAt)
                        .month(1)
                        .format("DD-MM-YYYY HH:mm")}
                    </b>
                  </li>
                  <li className="py-2 fs-5">
                    Start Process Ticket: <b>{data.start_process_ticket}</b>
                  </li>
                  <li className="py-2 fs-5">
                    End Date Ticket: <b>{data.end_date_ticket}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Updated At:{" "}
                    <b>
                      {moment(data.updatedAt)
                        .month(1)
                        .format("DD-MM-YYYY HH:mm")}
                    </b>
                  </li>
                </ul>
                <ul>
                  <li className="py-2 fs-5">
                    Ticket Status:{" "}
                    <b className={`text-${statusVariant}`}>{statusText}</b>
                  </li>
                  <li className="py-2 fs-5">
                    User Process:{" "}
                    <b className="text-success">{data.user_process}</b>
                    {level === "admin" || level === "head" ? (
                      <>
                        <br />
                        <Form.Group className="mb-3">
                          <Form.Select
                            onChange={(e) =>
                              handleChangeUserProcess(e, data.id)
                            }
                          >
                            <option defaultValue>Choose user process</option>
                            {teams.map((team) => {
                              return (
                                <option key={team.id} value={team.full_name}>
                                  {team.full_name}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </>
                    ) : null}
                  </li>
                  <li className="py-2 fs-5">
                    Subjek Request: <b>{data.requests_detail.subjek_request}</b>
                  </li>
                  <li className="py-2 fs-5">
                    Image Request:{" "}
                    <a
                      href={data.file.image}
                      className="btn btn-info btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "13px" }}
                    >
                      <b>Lihat gambar</b>
                    </a>
                  </li>
                  <li className="py-2 fs-5">
                    File Doc Request:{" "}
                    <a
                      href={data.file.file_document}
                      className="btn btn-info btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "13px" }}
                    >
                      <b>Lihat file</b>
                    </a>
                  </li>
                </ul>
              </div>
              {level === "team" ? (
                <>
                  {data.ticket_status === "D" ? null : (
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => {
                        return (
                          window.confirm("Anda yakin request telah selesai?") &&
                          handleDoneRequest(data.id)
                        );
                      }}
                    >
                      Request Done
                    </Button>
                  )}
                  <Button
                    variant="primary ms-3"
                    size="lg"
                    onClick={() =>
                      history.push(`${Routes.UserRequestTeam.path}`)
                    }
                  >
                    Back
                  </Button>
                </>
              ) : null}

              {level === "admin" || level === "head" ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => history.push(`${Routes.UserRequests.path}`)}
                >
                  Back
                </Button>
              ) : null}

              {level === "user" ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    history.push(`${Routes.ListUserRequests.path}`)
                  }
                >
                  Back
                </Button>
              ) : null}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
