import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Card,
  Table,
  Form,
  Button,
  Modal,
} from "@themesberg/react-bootstrap";
import { toast } from "react-toastify";

import {
  getAllUserData,
  getAllUserAdmin,
  getAllUserTeam,
  createUserData,
  deleteUserData,
  updateUserData,
} from "../../api/userApi";

export default () => {
  const [listUsers, setListUsers] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [levelUser, setLevelUser] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [user, setUser] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    level: "",
  });
  const handleClose = () => {
    setShowDefault(false);
    setUser({});
    setLevelUser(false);
  };
  const listLevel = ["admin", "team", "user"];

  useEffect(() => {
    (async () => {
      const getUsers = await getAllUserData();
      setListUsers(getUsers.data.data);
      setLevelUser(false);
      // if error status code 401 redirect to form login
      if (getUsers.error) {
        window.location.href = "/";
        localStorage.clear();
      }
    })();
  }, []);

  const handleChooseUserType = async (e) => {
    if (e.target.value === "admin") {
      const getUsers = await getAllUserAdmin();
      setLevelUser(true);
      setListUsers(getUsers.data.data);
    } else if (e.target.value === "team") {
      const getUsers = await getAllUserTeam();
      setLevelUser(true);
      setListUsers(getUsers.data.data);
    } else {
      const getUsers = await getAllUserData();
      setLevelUser(false);
      setListUsers(getUsers.data.data);
    }
  };

  const handleChangeUserLevel = (e) => {
    if (e.target.value === "admin" || e.target.value === "team") {
      setLevelUser(true);
    } else {
      setLevelUser(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const createUser = await createUserData(user);

    if (createUser.error) {
      toast.error("Create user failed");
    }

    listUsers.push(createUser.data.data);
    setShowDefault(false);
    toast.success("Create user success");
  };

  const handleDeleteUser = async (id, level) => {
    try {
      await deleteUserData(id, level);
      toast.success("Delete user success");

      const newListUsers = listUsers.filter((user) => user.id !== id);
      setListUsers(newListUsers);
    } catch (error) {
      toast.error("Delete user failed :(");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserData(user.id, user);
      window.location.reload();
      toast.success("Update user successfully!");
    } catch (error) {
      toast.error("Update user failed :(");
    }
  };

  const userLists = listUsers.map((request) => {
    return (
      <>
        <tr key={request.id}>
          <td>{request.id}</td>
          {levelUser ? (
            <td>
              <span className="fw-normal">{request.full_name}</span>
            </td>
          ) : null}
          <td>
            <span className="fw-normal">{request.username}</span>
          </td>
          <td>
            <span className="fw-normal">{request.email}</span>
          </td>
          <td>
            <span className="fw-normal">{request.level}</span>
          </td>
          <td>
            <div>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  setUser({
                    id: request.id,
                    full_name: request.full_name,
                    username: request.username,
                    email: request.email,
                    level: request.level,
                  });
                  setIsUpdate(true);
                  setShowDefault(true);
                  setModalTitle("Update User");
                }}
              >
                {" "}
                Edit{" "}
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                size="sm"
                onClick={() => handleDeleteUser(request.id, request.level)}
              >
                {" "}
                Delete{" "}
              </Button>
            </div>
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
            <Breadcrumb.Item>Users Data</Breadcrumb.Item>
            <Breadcrumb.Item active>List Users Data</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Users Data</h4>
        </div>
      </div>
      <div
        className="pb-3 d-flex justify-content-start"
        style={{ width: "500px" }}
      >
        <Button
          variant="secondary"
          onClick={() => {
            setShowDefault(true);
            setModalTitle("Create New User");
          }}
        >
          Create User
        </Button>
        <Form.Group className="ms-3" style={{ width: "200px" }}>
          <Form.Select
            required
            onChange={(e) => {
              handleChooseUserType(e);
            }}
          >
            <option defaultValue>Choose user type</option>
            <option value="admin">admin</option>
            <option value="team">team</option>
            <option value="user">user</option>
          </Form.Select>
        </Form.Group>
      </div>
      <Card
        border="light"
        className="table-wrapper table-responsive shadow-sm w-100"
      >
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">ID</th>
                {levelUser ? (
                  <th className="border-bottom">Full Name</th>
                ) : null}
                <th className="border-bottom">Username</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Level</th>
                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            <tbody>{userLists}</tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="h6"> {modalTitle} </Modal.Title>
          <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Form
          onSubmit={(e) =>
            isUpdate ? handleUpdateUser(e) : handleCreateUser(e)
          }
        >
          <Modal.Body>
            <Form.Group controlId="levelUser" className="mb-3">
              <Form.Label>User Level</Form.Label>
              <Form.Select
                required
                id="levelUser"
                onChange={(e) => {
                  handleChangeUserLevel(e);
                  setUser({ ...user, level: e.target.value });
                }}
              >
                <option defaultValue>Choose user level</option>
                {listLevel.map((level) => {
                  if (level === user.level) {
                    return (
                      <option value={level} selected>
                        {level}
                      </option>
                    );
                  } else {
                    return <option value={level}>{level}</option>;
                  }
                })}
              </Form.Select>
            </Form.Group>

            {levelUser ? (
              <Form.Group controlId="fullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  id="fullName"
                  value={user.full_name}
                  required
                  onChange={(e) =>
                    setUser({ ...user, full_name: e.target.value })
                  }
                />
              </Form.Group>
            ) : null}

            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                id="username"
                value={user.username}
                required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                value={user.email}
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="submit">
              Save
            </Button>
            <Button
              variant="default"
              className="text-gray ms-auto"
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
