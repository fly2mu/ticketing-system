import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faHandHolding,
  faHashtag,
  faSignOutAlt,
  faTimes,
  faUserCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from "@themesberg/react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useJwt } from "react-jwt";

import { Routes } from "../routes";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import { toast } from "react-toastify";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const level = localStorage.getItem("level");
  const token = localStorage.getItem("token");
  const { isExpired } = useJwt(token);
  const history = useHistory();

  useEffect(() => {
    if (isExpired) {
      localStorage.clear();
      toast.warning("Access denied!!!");
      toast.error("Your session has expired. Please login again.");
      history.push(Routes.Signin.path);
    } else if (!token) {
      history.push(Routes.Signin.path);
    }
  }, [isExpired, token, history]);
  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item
          eventKey={eventKey}
          style={{ background: "none", border: "none" }}
        >
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center text-dark border-0"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <span className="sidebar-icon text-dark">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between text-white"
      : "border-0 text-white";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon text-dark">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text text-dark">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  // const conditionalLevel = () => {
  //   if (level == "admin") {
  //     <>
  //       <CollapsableNavItem
  //         eventKey="requests/"
  //         title="Requests"
  //         icon={faHandHolding}
  //       >
  //         <NavItem
  //           title="User Requests"
  //           icon={faHandHolding}
  //           link={Routes.UserRequests.path}
  //         />

  //         <NavItem
  //           title="Categories"
  //           icon={faHashtag}
  //           link={Routes.Categories.path}
  //         />
  //       </CollapsableNavItem>

  //       <NavItem title="Users" icon={faUsers} link={Routes.UserData.path} />
  //     </>;
  //   } else {
  //     <CollapsableNavItem
  //       eventKey="requests/"
  //       title="Requests"
  //       icon={faHandHolding}
  //     >
  //       <NavItem title="Add Requests" link={Routes.AddRequest.path} />
  //       <NavItem title="List Requests" link={Routes.ListUserRequests.path} />
  //     </CollapsableNavItem>;
  //   }
  // };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="px-4 d-md-none"
        style={{ backgroundColor: "#ffcc00" }}
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.DashboardOverview.path}
        >
          <Image src={ReactHero} className="navbar-brand-dark" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block text-dark`}
          style={{ backgroundColor: "#ffcc00" }}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle"
                  />
                </div>
                <div className="d-block">
                  <h6>Hi, {localStorage.getItem("username")}</h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    to={Routes.Signin.path}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0 text-dark">
              <NavItem title="Ticketing" image={ReactHero} />

              <NavItem
                title="Overview"
                link={Routes.DashboardOverview.path}
                icon={faChartPie}
              />

              {level === "admin" ? (
                <>
                  <CollapsableNavItem
                    eventKey="requests/"
                    title="Requests"
                    icon={faHandHolding}
                  >
                    <NavItem
                      title="User Requests"
                      icon={faHandHolding}
                      link={Routes.UserRequests.path}
                    />

                    <NavItem
                      title="Categories"
                      icon={faHashtag}
                      link={Routes.Categories.path}
                    />
                  </CollapsableNavItem>

                  <NavItem
                    title="Users"
                    icon={faUsers}
                    link={Routes.UserData.path}
                  />

                  <NavItem
                    title="Profile"
                    icon={faUserCircle}
                    link={Routes.Profile.path}
                  />
                </>
              ) : null}

              {level === "user" ? (
                <>
                  <CollapsableNavItem
                    eventKey="requests/"
                    title="Requests"
                    icon={faHandHolding}
                  >
                    <NavItem
                      title="Add Requests"
                      link={Routes.AddRequest.path}
                    />
                    <NavItem
                      title="List Requests"
                      link={Routes.ListUserRequests.path}
                    />
                  </CollapsableNavItem>

                  <NavItem
                    title="Profile"
                    icon={faUserCircle}
                    link={Routes.Profile.path}
                  />
                </>
              ) : null}

              {level === "team" ? (
                <>
                  <NavItem
                    title="User Requests"
                    icon={faHandHolding}
                    link={Routes.UserRequestTeam.path}
                  />

                  <NavItem
                    title="Profile"
                    icon={faUserCircle}
                    link={Routes.Profile.path}
                  />
                </>
              ) : null}

              {/* <CollapsableNavItem
                eventKey="tables/"
                title="Tables"
                icon={faTable}
              >
                <NavItem
                  title="Bootstrap Table"
                  link={Routes.BootstrapTables.path}
                />
              </CollapsableNavItem> */}

              <Dropdown.Divider className="my-3 border-indigo" />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
