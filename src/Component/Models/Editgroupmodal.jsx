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

const Editgroupmodal = (props) => {
  const [show, setShow] = useState([]);
  const [show1, setShow1] = useState([]);
  const [users, setUsers] = useState([]);
  const selectedCheckboxesRef = useRef([]);
  const selectedAdminCheckboxesRef = useRef([]);
  const groupName = useRef();
  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);
  useEffect(() => {
    if (groupName.current) {
      groupName.current.value = props.groupName;
    }
  }, [props.groupName]);
  const handleCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      selectedCheckboxesRef.current = [
        ...selectedCheckboxesRef.current,
        userId,
      ];

      setShow1(selectedCheckboxesRef.current);
    } else {
      selectedCheckboxesRef.current = selectedCheckboxesRef.current.filter(
        (id) => id !== userId
      );
      setShow1(selectedCheckboxesRef.current);
    }
  };
  const handleAdminCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      selectedAdminCheckboxesRef.current = [
        ...selectedAdminCheckboxesRef.current,
        userId,
      ];
      setShow(selectedAdminCheckboxesRef.current);
    } else {
      selectedAdminCheckboxesRef.current =
        selectedAdminCheckboxesRef.current.filter((id) => id !== userId);
      setShow(selectedAdminCheckboxesRef.current);
    }
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    // const token = localStorage.getItem("token");
    const groupId = localStorage.getItem("groupId");
    const enteredGroupName = groupName.current.value;
    const obj = {
      groupId,
      name: enteredGroupName,
      users: selectedCheckboxesRef.current,
      isAdmin: selectedAdminCheckboxesRef.current,
    };
    await axios.post("http://localhost:5000/updateGroupInfo", obj);
    alert("updated details")
    props.handleClose()
  };
  const deleteGroupHandler = () => {
    alert("are you sure you want to delete this group?");
    console.log("DELETE GROUP");
  };
  const rows = users.map((item) => {
    const style = item.isAdmin ? true : false;
    const style2 = show1.filter((obj) => obj === item.id);
    const style3 = show.filter((obj) => obj === item.id);
    return (
      <Row key={item.id}>
        <Col lg={6}>
          {item.name}({item.isAdmin ? "Is admin" : "not admin"})
        </Col>
        <Col lg={3}>
          <Form.Check
            type="checkbox"
            label="remove user"
            onChange={(event) => handleCheckboxChange(event, item.id)}
            disabled={style || style3.length > 0}
          />
        </Col>
        <Col lg={3}>
          <Form.Check
            type="checkbox"
            label="make admin"
            onChange={(event) => handleAdminCheckboxChange(event, item.id)}
            disabled={style || style2.length > 0}
          />
        </Col>
      </Row>
    );
  });
  return (
    <Fragment>
      <Modal
        size="lg"
        show={props.show}
        onHide={props.handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Group Participants </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitHandler}>
          <Modal.Body>
            <Container>
              {/* <Form onSubmit={submitHandler}> */}
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Group Name</InputGroup.Text>
                <Form.Control
                  placeholder="Edit Group Name"
                  id="groupinput"
                  ref={groupName}
                />
              </InputGroup>
              {rows}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button> */}
            <Button variant="primary" type="submit">
              Edit Group
            </Button>
            <Button variant="danger" onClick={deleteGroupHandler}>
              Delete Group
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Editgroupmodal;
Editgroupmodal.propTypes = {
  groupName: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  users: PropTypes.array,
};
