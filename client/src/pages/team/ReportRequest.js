import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  Breadcrumb,
} from "@themesberg/react-bootstrap";
import React from "react";

export default function ReportRequest() {
  return (
    <Container>
      <Card.Title>
        <h5>Report Request</h5>
      </Card.Title>
      <Row className="align-items-center">
        <Col>
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="startDate" />
        </Col>
        <Col>
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" name="endDate" />
        </Col>
        <Col>
          <Button variant="primary" size="md">
            Confirm
          </Button>
        </Col>
      </Row>

      <Card
        border="light"
        className="table-wrapper table-responsive shadow-sm w-100 mt-3"
      >
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">ID Request</th>
              <th className="border-bottom">User request</th>
              <th className="border-bottom">Date request</th>
              <th className="border-bottom">Title request</th>
              <th className="border-bottom">User process</th>
              <th className="border-bottom">Status request</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>
                <span className="fw-normal">John Doe</span>
              </td>
              <td>
                <span className="fw-normal">Date request</span>
              </td>
              <td>
                <span className="fw-normal">Title request</span>
              </td>
              <td>
                <span className="fw-normal">User process</span>
              </td>
              <td>
                <span>Status</span>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
