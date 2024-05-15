import { Fragment, useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import classes from "./Inputbox.module.css";
import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ListGroup } from "react-bootstrap";
import Inputmodal from "../Models/Inputmodel";
import PropTypes from "prop-types";
import axios from "axios";

const Inputbox = (props) => {
  const PORT = import.meta.env.VITE_REACT_PORT;
  const [slectedFile, setSelectedFile] = useState(null);
  const [isRotated, setRotated] = useState(false);
  const [showList, setShowList] = useState(false);
  const chatRef = useRef(null);

  const sendHandler = (event) => {
    event.preventDefault();
    const enteredMessage = chatRef.current.value;
    const token = localStorage.getItem("token");
    const postMessage = async () => {
      try {
        const groupId = localStorage.getItem("groupId") || null;
        const receiverId = localStorage.getItem("receiverId") || null;
        let url = null;
        const response = await axios.post(
          `${PORT}/add-message`,
          {
            message: enteredMessage,
            fileUrl: url,
            groupId: groupId,
            receiverId: receiverId,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        props.sendToParent(response.data.data);
        setSelectedFile(null);

        chatRef.current.value = "";
        chatRef.current.focus();
      } catch (err) {
        alert(err);
      }
    };
    postMessage();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleClick = () => {
    setRotated(!isRotated);
  };
  const handleClose = () => {
    setShowList(!showList);
  };
  const imageHandler = () => {
    setShowList(!showList);
  };
  return (
    <Fragment>
      <Inputmodal
        show={showList}
        handleClose={handleClose}
        sendSocket={props.sendToParent}
        changeCross={() => {
          setRotated(false);
        }}
      />

      {isRotated && (
        <ListGroup className={classes.listitem}>
          <ListGroup.Item as={Button} onClick={imageHandler}>
            Send images
          </ListGroup.Item>
          <ListGroup.Item as={Button}>Send video</ListGroup.Item>
        </ListGroup>
      )}
      <div className={classes.box1}>
        <Row>
          <Col
            lg={1}
            md={1}
            sm={1}
            xs={2}
            // style={{ width: "2%" }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FaPlus
              style={{
                transform: isRotated ? "rotate(135deg)" : "rotate(0deg)",
                fontSize: "1.7rem",
                alignSelf: "center",
              }}
              className={classes.crossicon}
              onClick={handleClick}
            />
          </Col>
          <Col lg={11} md={11} sm={11} xs={10}>
            <form onSubmit={sendHandler} className={classes.inputtext}>
              <input
                placeholder="Enter Message"
                type="text"
                ref={chatRef}
                required
              />

              <button className={classes.sendbutton} type="submit">
                <IoSend />
              </button>
            </form>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default Inputbox;
Inputbox.propTypes = {
  sendToParent: PropTypes.func.isRequired,
};
