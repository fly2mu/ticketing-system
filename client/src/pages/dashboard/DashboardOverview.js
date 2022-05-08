import React, { useEffect, useState } from "react";
import {
  faBars,
  faCheckCircle,
  faHandHolding,
  faUserCircle,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "@themesberg/react-bootstrap";

import { CounterWidget } from "../../components/Widgets";
import {
  getRequestWaiting,
  getRequestProcess,
  getRequestDone,
} from "../../api/requestApi";
import { getUsersCount, getTeamsCount } from "../../api/userApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

export default () => {
  const [countRequest, setCountRequest] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const level = localStorage.getItem("level");
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        if (level === "admin") {
          const countUsers = await getUsersCount();
          const countTeams = await getTeamsCount();
          setUsersCount(countUsers.data.data);
          setTeamsCount(countTeams.data.data);

          const getWaiting = await getRequestWaiting();
          setWaitingCount(getWaiting.data.data.length);

          const getProcess = await getRequestProcess();
          setProcessCount(getProcess.data.data.length);

          const getDone = await getRequestDone();
          setDoneCount(getDone.data.data.length);
          setCountRequest(
            getWaiting.data.data.length +
              getProcess.data.data.length +
              getDone.data.data.length
          );
        } else {
          const getWaiting = await getRequestWaiting();
          setWaitingCount(getWaiting.data.data.length);

          const getProcess = await getRequestProcess();
          setProcessCount(getProcess.data.data.length);

          const getDone = await getRequestDone();
          setDoneCount(getDone.data.data.length);
        }
      } catch (error) {
        console.log(error);
        toast.error("You are not authorized!");
        history.push("/");
      }
    })();
  }, [history, level]);
  return (
    <div>
      {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <ButtonGroup>
          <Button variant="outline-primary" size="sm">
            Share
          </Button>
          <Button variant="outline-primary" size="sm">
            Export
          </Button>
        </ButtonGroup>
      </div> */}

      <Row className="justify-content-md-center mt-5">
        {level === "admin" ? (
          <>
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Users"
                title={usersCount}
                icon={faUserCircle}
                iconColor="shape-secondary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Teams"
                title={teamsCount}
                icon={faUsersCog}
                iconColor="shape-tertiary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Requests"
                title={countRequest}
                icon={faHandHolding}
                iconColor="shape-tertiary"
              />
            </Col>
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Waiting"
                title={waitingCount}
                icon={faHandHolding}
                iconColor="shape-secondary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Process"
                title={processCount}
                icon={faBars}
                iconColor="shape-tertiary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Done"
                title={doneCount}
                icon={faCheckCircle}
                iconColor="shape-tertiary"
              />
            </Col>
          </>
        ) : null}

        {level === "team" ? (
          <>
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Waiting"
                title={waitingCount}
                icon={faHandHolding}
                iconColor="shape-secondary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Process"
                title={processCount}
                icon={faBars}
                iconColor="shape-tertiary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Done"
                title={doneCount}
                icon={faCheckCircle}
                iconColor="shape-tertiary"
              />
            </Col>
          </>
        ) : null}

        {level === "user" ? (
          <>
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Waiting"
                title={waitingCount}
                icon={faHandHolding}
                iconColor="shape-secondary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Process"
                title={processCount}
                icon={faBars}
                iconColor="shape-tertiary"
              />
            </Col>

            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Done"
                title={doneCount}
                icon={faCheckCircle}
                iconColor="shape-tertiary"
              />
            </Col>
          </>
        ) : null}
      </Row>

      {/* <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders}
                  />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </div>
  );
};
