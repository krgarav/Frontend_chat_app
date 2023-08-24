import { Fragment, useEffect, useState } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import _ from "lodash";
import io from "socket.io-client";
import Invitemodal from "../Models/Invitemodal";
import Headelement from "../Headelement/Headelement";

const ENDPOINT = "http://localhost:5000";
var socket;
const Mainpage = () => {
  const [messages, setMessages] = useState([]);
  const [groupItem, setGroupItem] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);
  const [stateHandler, setStateHAndler] = useState(false);
  const navigate = useNavigate();

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

  const token = localStorage.getItem("token");
  const localMessages = JSON.parse(localStorage.getItem("messages")) || [];
  let lastMessageId = 1;
  if (localMessages.length != 0) {
    lastMessageId = localMessages[localMessages.length - 1].id;
  }
  const getChats = async (grpId) => {
    let groupId = grpId || null;
    const response = await axios.get(
      `http://localhost:5000/get-message?lastMessageId=${lastMessageId}&groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const arrayData = await response.data.chats;
    console.log(arrayData);
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
    const response = await axios.get("http://localhost:5000/getGroup", {
      headers: {
        Authorization: token,
      },
    });
    const data = response.data.groupInfo;
    setGroupItem(data);
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };
  const newGroupHandler = () => {
    setShow(true);
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
        "http://localhost:5000/getUsers" + groupId,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      getChats(groupId);
      setGroupName(item.name);
      setStateHAndler((prev) => !prev);
      setIsAdmin(response.data.isAdminUser);
      setUsersPresent(response.data.allUserIds);
    };

    getReq();

    localStorage.setItem("groupId", groupId);
  };
  const allListItems = messages.map((item, index) => {
    const inputString = item.name;
    const result = _.startCase(_.toLower(inputString));
    return (
      <ListGroup.Item key={index} variant={index % 2 === 0 ? "" : "secondary"}>
        {result} : {item.message}
        {item.fileUrl && (
          <img
            src={item.fileUrl}
            width={200}
            height={200}
            alt="Uploaded"
            style={{ float: "right" }}
          />
        )}
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
        {item.name}
      </ListGroup.Item>
    );
  });
  return (
    <Fragment>
      <button onClick={logoutHandler}>Logout</button>
      <button onClick={newGroupHandler}>Create new group</button>
      <h1>Chat App</h1>
      <div className={classes.container}>
        <div className={classes.container1}>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              variant="info"
              onClick={() => {
                localStorage.removeItem("groupId");
                setGroupName(null);
                getChats();
              }}
            >
              All Messages
            </ListGroup.Item>
            {allGroupListItems}
          </ListGroup>
        </div>
        <div className={classes.listbox}>
          <Headelement
            userArray={usersPresent}
            state={isAdmin}
            groupName={groupName}
          />
          <div className={classes.scrollableList}>
            <ListGroup>{allListItems}</ListGroup>
          </div>
        </div>
        {show && (
          <Invitemodal
            show={show}
            handleClose={() => {
              setShow(false);
            }}
          />
        )}
      </div>
      <footer className={classes.footer}>
        <Inputbox sendToParent={changeStateHandler} />
      </footer>
    </Fragment>
  );
};

export default Mainpage;
