import { Fragment } from "react";
import { Container, Navbar } from "react-bootstrap";
const Headelement = (props) => {
  const usersPresent = props.userArray;
  let usersName = "";
  for (const item of usersPresent) {
    usersName += item.name + ", ";
  }
  return (
    <Fragment>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>All Users</Navbar.Brand>
          <Navbar.Text>{usersName}</Navbar.Text>
        </Container>
      </Navbar>
    </Fragment>
  );
};
export default Headelement;
