import { Fragment, useState } from "react";
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router";
import Invitemodal from "../Models/Invitemodal";
import {BsFillPersonFill} from "react-icons/bs"
import PropTypes from 'prop-types';
const Mainheaderelement = (props) => {
 
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const userName=localStorage.getItem("userName");
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };
  const newGroupHandler = () => {
    setShow(true);
  };
  return (
    <Fragment>
      <Navbar  bg="light" data-bs-theme="light" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <p><BsFillPersonFill/> {userName}</p>
          </Navbar.Brand>
          <NavDropdown title="" id="basic-nav-dropdown" >
            <NavDropdown.Item as="button" onClick={newGroupHandler}>
              Create Group
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as="button" onClick={logoutHandler}>
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