import { Fragment, useState } from "react";
import {
  Container,
  Navbar,
  Button,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";
import Editgroupmodal from "../Models/Editgroupmodal";
import PropTypes from "prop-types";
import classes from "./Headelement.module.css";
import { FiAlignJustify } from "react-icons/fi";
import { FaVideo } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import _ from "lodash";
const Headelement = (props) => {
  const [show, setShow] = useState(false);
  const [rotation, setRotation] = useState(0);
  const usersPresent = props.userArray;
  let usersName = "";
  for (const item of usersPresent) {
    const result = _.startCase(_.toLower(item.name));
    usersName += result + ", ";
  }
  const editHandler = () => {
    setShow(true);
  };

  const toggleHandler = () => {
    setRotation(rotation + 90);
    // const listBox = document.getElementById("listBox");
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.classList.toggle(classes.listToggler);
    const blurDiv = document.getElementById("blur");
    blurDiv.classList.toggle(classes.blurToggler);
  };
  return (
    <Fragment>
      <Navbar  className="bg-body-tertiary" sticky="top">
        <Row lg={12} style={{width:"100%"}}>
          <Col lg={4} xl={4} xs={4} >
            <Navbar.Brand style={{ display: "flex" }}>
              <span
                id="blurToggler"
                onClick={toggleHandler}
                className={classes.toggleBar}
                style={{
                  // marginLeft: "10px",
                  marginRight: "5px",
                  alignSelf: "center",
                }}
              >
                <FiAlignJustify />
              </span>
              <h4 style={{ marginLeft: "5px", alignSelf: "center" }}>
                {props.groupName}
              </h4>
            </Navbar.Brand>
          </Col>
          <Col lg={6} xl={6} xs={6}>
            <Navbar.Text> {usersName}</Navbar.Text>
          </Col>
          <Col lg={1} xl={1} xs={1}>
            <FaVideo />
          </Col>
          <Col lg={1} xl={1} xs={1}>
            <NavDropdown
              title={<PiDotsThreeOutlineVerticalFill />}
              id="edit-group-dropdown"
              drop="start"
              alignRight={false}
            >
              <NavDropdown.Item onClick={editHandler} disabled={!props.state}>
                Edit
              </NavDropdown.Item>
            </NavDropdown>
          </Col>
        </Row>
        {/* </Container> */}
      </Navbar>
      {show && (
        <Editgroupmodal
          show={show}
          handleClose={() => {
            setShow(false);
          }}
          groupName={props.groupName}
          users={props.userArray}
        />
      )}
    </Fragment>
  );
};
export default Headelement;
Headelement.propTypes = {
  userArray: PropTypes.array,
  groupName: PropTypes.string,
  state: PropTypes.bool,
};
