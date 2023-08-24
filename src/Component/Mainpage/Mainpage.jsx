import { Fragment, useEffect, useState } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
import io from "socket.io-client";
import Headelement from "../Headelement/Headelement";
import Mainheaderelement from "../Headelement/Mainheadelement";
import { HiUserGroup } from "react-icons/hi";
import CloseButton from "react-bootstrap/CloseButton";
const ENDPOINT = "http://43.205.148.73:5000";
var socket;
const Mainpage = () => {
  const [messages, setMessages] = useState([]);
  const [groupItem, setGroupItem] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    getChats();
    getGroups();
    return () => {
      socket.disconnect(); // Close the socket connection
    };
  }, []);

  useEffect(() => {
    socket.on("message received", (obj) => {
      const currentGroupId = localStorage.getItem("groupId") || null;
      const newReceivedMessage = obj.message;
      const groupId = obj.groupId;
      if (currentGroupId === groupId) {
        setMessages([...messages, newReceivedMessage]);
      } else {
        console.log("else called");
      }
    });

    return () => {
      socket.off("message received");
    };
  });
  useEffect(() => {
    socket.on("group created", (obj) => {
      const userId = +localStorage.getItem("userId");
      const userIDs = obj.userInfo.map((item) => item.id);
      console.log(userIDs , userId)
      if (userIDs.includes(userId)) {
        setGroupItem([...groupItem, obj.groupInfo]);
      } else {
        console.log("not entered");
      }
    });

    return () => {
      socket.off("group created");
    };
  });

  const token = localStorage.getItem("token");
  const localMessages = JSON.parse(localStorage.getItem("messages")) || [];
  let lastMessageId = 1;
  if (localMessages.length != 0) {
    lastMessageId = localMessages[localMessages.length - 1].id;
  }
  const getChats = async (grpId) => {
    let groupId = grpId || null;
    const response = await axios.get(
      `http://43.205.148.73:5000/get-message?lastMessageId=${lastMessageId}&groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const arrayData = await response.data.chats;
    let concatedArray = [];
    if (localMessages.length != 0) {
      concatedArray = [...localMessages, ...arrayData];
    } else {
      concatedArray = arrayData;
    }
    let slicedArray = [];
    if (concatedArray.length > 10) {
      slicedArray = concatedArray.slice(-10);
    } else {
      slicedArray = concatedArray;
    }
    // const stringified = JSON.stringify(slicedArray);
    // localStorage.setItem("messages", stringified);
    // console.log(slicedArray);
    setMessages(slicedArray);
  };
  const getGroups = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://43.205.148.73:5000/getGroup", {
      headers: {
        Authorization: token,
      },
    });
    const data = response.data.groupInfo;
    setGroupItem(data);
  };

  const changeStateHandler = (message) => {
    const groupId = localStorage.getItem("groupId");
    const obj = { groupId, message, usersPresent };
    socket.emit("new message", obj);
  };
  const listGroupHandler = (item) => {
    const groupId = item.id;
    localStorage.setItem("groupId", groupId);
    const token = localStorage.getItem("token");
    const getReq = async () => {
      const response = await axios.get(
        "http://43.205.148.73:5000/getUsers" + groupId,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      getChats(groupId);
      setGroupName(item.name);
      setIsAdmin(response.data.isAdminUser);
      setUsersPresent(response.data.allUserIds);
    };

    getReq();

    localStorage.setItem("groupId", groupId);
  };

  const handleSocket = async (obj) => {
    const groupId = obj.id;
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://43.205.148.73:5000/getUsers" + groupId,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const newObj = {
      groupInfo: obj,
      userInfo: response.data.allUserIds,
    };
    console.log(newObj);
    socket.emit("group create",newObj);
  };
  const deleteChatHandler = (chatId) => {
    console.log(chatId);
  };
  const allListItems = messages.map((item, index) => {
    const inputString = item.name;
    const result = _.startCase(_.toLower(inputString));
    return (
      <ListGroup.Item key={index} variant={index % 2 === 0 ? "" : "secondary"}>
        <Container>
          <Row>
            <Col lg={4}>
              <p>
                {result} : {item.message}
              </p>
            </Col>
            <Col lg={4}></Col>
            <Col lg={4}>
              <CloseButton
                onClick={() => deleteChatHandler(item.id)}
                style={{ float: "right" }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {item.fileUrl && (
                <img
                  src={item.fileUrl}
                  width={200}
                  height={200}
                  alt="Uploaded"
                  style={{ float: "right" }}
                />
              )}
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    );
  });
  const allGroupListItems = groupItem.map((item) => {
    return (
      <ListGroup.Item
        key={item.id}
        action
        variant="info"
        onClick={() => {
          listGroupHandler(item);
        }}
      >
        <HiUserGroup /> {item.name}
      </ListGroup.Item>
    );
  });
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.container1}>
          <Mainheaderelement handleSocket={handleSocket} />
          <div className={classes.scrollableList}>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                variant="info"
                onClick={() => {
                  localStorage.removeItem("groupId");
                  setUsersPresent([]);
                  setGroupName(null);
                  setIsAdmin(false);
                  getChats();
                }}
              >
                All Messages
              </ListGroup.Item>
              {allGroupListItems}
            </ListGroup>
          </div>
        </div>
        <div className={classes.listbox}>
          <Headelement
            userArray={usersPresent}
            state={isAdmin}
            groupName={groupName}
          />
          <div className={classes.scrollableList}>
            {allListItems.length > 0 && <ListGroup>{allListItems}</ListGroup>}
            {allListItems.length === 0 && <p>No messages are present</p>}
          </div>
        </div>
      </div>
      <footer className={classes.footer}>
        <Inputbox sendToParent={changeStateHandler} />
      </footer>
    </Fragment>
  );
};

export default Mainpage;
