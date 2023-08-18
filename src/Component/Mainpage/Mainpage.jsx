import { Fragment, useEffect, useState } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import _ from "lodash";
import Invitemodal from "../Models/Invitemodal";
import Headelement from "../Headelement/Headelement";
const Mainpage = () => {
  const [messages, setMessages] = useState([]);
  const [groupItem, setGroupItem] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const localMessages = JSON.parse(localStorage.getItem("messages")) || [];
    let lastMessageId = 1;
    if (localMessages.length != 0) {
      lastMessageId = localMessages[localMessages.length - 1].id;
    }
    const getChats = async () => {
      let groupId = localStorage.getItem("groupId") || null;

      const response = await axios.get(
        `http://localhost:3000/get-message?lastMessageId=${lastMessageId}&groupId=${groupId}`,
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
      const stringified = JSON.stringify(slicedArray);
      localStorage.setItem("messages", stringified);
      setMessages(slicedArray);
    };
    const getGroups = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/getGroup", {
        headers: {
          Authorization: token,
        },
      });
      const data = response.data.groupInfo;
      setGroupItem(data);
    };
    // getChats();
    // getGroups();
    const id = setInterval(() => {
      getChats();
      getGroups();
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };
  const newGroupHandler = () => {
    setShow(true);
  };
  const listGroupHandler = (item) => {
    const groupId = item.id;
    localStorage.setItem("groupId", groupId);
    const token = localStorage.getItem("token");
    const getReq = async () => {
      const response = await axios.get(
        "http://localhost:3000/getUsers" + groupId,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log(response.data);
      setGroupName(item.name);
      console.log(response.data);
      setIsAdmin(response.data.isAdminUser);
      setUsersPresent(response.data.allUserIds);
    };

    getReq();
    localStorage.removeItem("messages");
    localStorage.setItem("groupId", groupId);
  };
  const allListItems = messages.map((item, index) => {
    const inputString = item.name;
    const result = _.startCase(_.toLower(inputString));
    return (
      <ListGroup.Item key={index} variant={index % 2 === 0 ? "" : "secondary"}>
        {result} : {item.message}
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
                localStorage.removeItem("messages");
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
          <ListGroup>{allListItems}</ListGroup>
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
        <Inputbox />
      </footer>
    </Fragment>
  );
};

export default Mainpage;
