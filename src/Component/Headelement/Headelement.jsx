import { Fragment, useState } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Editgroupmodal from "../Models/Editgroupmodal";
import _ from "lodash";
const Headelement = (props) => {
  const [show, setShow] = useState(false);
  const usersPresent = props.userArray;
  let usersName = "";
  for (const item of usersPresent) {
    const result = _.startCase(_.toLower(item.name));
    usersName += result + ", ";
  }
  const editHandler = () => {
    setShow(true);
  };
  return (
    <Fragment>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand><h3>{props.groupName}</h3></Navbar.Brand>
          <Navbar.Text>{usersName}</Navbar.Text>
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
