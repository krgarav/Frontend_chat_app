import { Fragment, useState } from "react";
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router";
import Invitemodal from "../Models/Invitemodal";
import { BsFillPersonFill } from "react-icons/bs";
import PropTypes from "prop-types";
import classes from "./Mainheadelement.module.css";

const Mainheaderelement = (props) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };
  const newGroupHandler = () => {
    setShow(true);
  };
  return (
    <Fragment>
      <Navbar bg="light" data-bs-theme="light" className="bg-body-tertiary">
        <Container>
          <p style={{ fontSize: "1.5rem" }}>
            <BsFillPersonFill /> {userName}
          </p>
          <NavDropdown
            title=""
            id="basic-nav-dropdown"
            drop="down"
            alignRight
            className={classes.dropdown}
          >
            <NavDropdown.Item  onClick={newGroupHandler}>
              Create Group
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item  onClick={logoutHandler}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Container>
      </Navbar>
      {show && (
        <Invitemodal
          show={show}
          handleClose={() => {
            setShow(false);
          }}
          handleSocket={props.handleSocket}
        />
      )}
    </Fragment>
  );
};
export default Mainheaderelement;

Mainheaderelement.propTypes = {
  handleSocket: PropTypes.func,
};
