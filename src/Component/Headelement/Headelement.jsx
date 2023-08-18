import { Fragment, useState } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Editgroupmodal from "../Models/Editgroupmodal";
const Headelement = (props) => {
  const [show, setShow] = useState(false);
  const usersPresent = props.userArray;
  let usersName = "";
  for (const item of usersPresent) {
    usersName += item.name + ", ";
  }
  const editHandler = () => {
    setShow(true);
  };
  return (
    <Fragment>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>All Users</Navbar.Brand>
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
