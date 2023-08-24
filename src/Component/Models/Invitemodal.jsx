import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import PropTypes from "prop-types";

const Invitemodal = (props) => {
  const [users, setUsers] = useState([]);
  const selectedCheckboxesRef = useRef([]);
  const groupName = useRef();
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://43.205.148.73:5000/user/getUser", {
        headers: { Authorization: token },
      });
      const allUsers = response.data.user;
      setUsers(allUsers);
    };
    getUser();
  }, []);

  const handleCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      selectedCheckboxesRef.current = [
        ...selectedCheckboxesRef.current,
        userId,
      ];
    } else {
      selectedCheckboxesRef.current = selectedCheckboxesRef.current.filter(
        (id) => id !== userId
      );
    }
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const enteredGroupName = groupName.current.value;
    const obj = {
      name: enteredGroupName,
      users: selectedCheckboxesRef.current,
    };
    const response = await axios.post(
      "http://43.205.148.73:5000/createGroup",
      obj,
      {
        headers: { Authorization: token },
      }
    );
    props.handleSocket(response.data.data);
    props.handleClose();
  };
  const rows = users.map((item) => {
    return (
      <Row key={item.id}>
        <Col lg={6}>{item.name}</Col>
        <Col lg={6}>
          <Form.Check
            type="checkbox"
            onChange={(event) => handleCheckboxChange(event, item.id)}
          />
        </Col>
      </Row>
    );
  });
  return (
    <Fragment>
      <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Group Participations </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitHandler}>
          <Modal.Body>
            <Container>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Group Name</InputGroup.Text>
                <Form.Control
                  placeholder="Enter Group Name"
                  ref={groupName}
                  required
                />
              </InputGroup>
              {rows}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create Group
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Invitemodal;
Invitemodal.propTypes = {
  groupName: PropTypes.string,
  handleClose: PropTypes.func,
  handleSocket: PropTypes.func,
  show: PropTypes.bool,
};
