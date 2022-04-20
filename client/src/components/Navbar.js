import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  Nav,
  Image,
  Navbar,
  Dropdown,
  Container,
} from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";

import Profile3 from "../assets/img/team/profile-picture-3.jpg";

export default (props) => {
  const history = useHistory();

  const logoutHandler = () => {
    console.log("Logout tapped");
    localStorage.clear();
    return history.push("/");
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-end w-100">
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image
                    src={Profile3}
                    className="user-avatar md-avatar rounded-circle"
                  />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">
                      {localStorage.getItem("username")}
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item
                  className="fw-bold"
                  onClick={() => history.push("/profile")}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> My
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => logoutHandler()}
                  className="fw-bold"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />{" "}
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
