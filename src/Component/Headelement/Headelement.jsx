import { Fragment, useState } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Editgroupmodal from "../Models/Editgroupmodal";
import PropTypes from "prop-types";
import classes from "./Headelement.module.css";
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
      <Navbar className="bg-body-tertiary">
        <Container>
          <span
            id="blurToggler"
            onClick={toggleHandler}
            className={classes.toggleBar}
            style={{
              transform: `rotate(${90}deg)`,
              position: "absolute",
              right: "30%",
            }}
          >
            |||
          </span>
          <Navbar.Brand>
            <h3>{props.groupName}</h3>
          </Navbar.Brand>
          <Navbar.Text> {usersName}</Navbar.Text>
          <Button onClick={editHandler} disabled={!props.state}>
            Edit
          </Button>
        </Container>
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
