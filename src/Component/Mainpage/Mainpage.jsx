import { Fragment, useEffect, useState, useRef } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { Col, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
import io from "socket.io-client";
import Headelement from "../Headelement/Headelement";
import Mainheaderelement from "../Headelement/Mainheadelement";
import { HiUserGroup } from "react-icons/hi";
import { IoPerson } from "react-icons/io5";
import Imagemodal from "../Models/Imagemodal";
const PORT = import.meta.env.VITE_REACT_PORT;

const ENDPOINT = `${PORT}`;
var socket;
const Mainpage = () => {
  const [Allusers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groupItem, setGroupItem] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imgurl, setImgUrl] = useState("");
  const [imageShow, setImageShow] = useState(false);

  const listRef = useRef();
  useEffect(() => {
    const handleCtrlA = (event) => {
      // Check if Ctrl key is pressed while 'a' is pressed
      if (event.ctrlKey && event.key === 'a') {
        // Prevent the default behavior (text selection)
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleCtrlA);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleCtrlA);
    };
  }, []);

  useEffect(() => {
    const handleCopy = (event) => {
      // Prevent the default copy behavior
      event.preventDefault();
      // Optionally, you can display a message or perform some other action
      console.log("Copying is not allowed.");
    };

    // Add event listener to the entire component
    document.addEventListener("copy", handleCopy);


    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    getChats();
    getGroups();
    getMembers();
    return () => {
      socket.disconnect(); // Close the socket connection
    };
  }, []);
  useEffect(() => {
    // Scroll to the last list item when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);
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
      console.log(userIDs, userId);
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
      `${PORT}/get-message?lastMessageId=${lastMessageId}&groupId=${groupId}`,
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
    setMessages(slicedArray);
  };
  //get groups with axios
  const getGroups = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${PORT}/getGroup`, {
      headers: {
        Authorization: token,
      },
    });
    const data = response.data.groupInfo;
    setGroupItem(data);
  };

  const getMembers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${PORT}/user/getUser`, {
      headers: { Authorization: token },
    });
    const allUsers = response.data.user;
    setAllUsers(allUsers);
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
      const response = await axios.get(`${PORT}/getUsers` + groupId, {
        headers: {
          Authorization: token,
        },
      });
      getChats(groupId);
      setGroupName(item.name);
      setIsAdmin(response.data.isAdminUser);
      setUsersPresent(response.data.allUserIds);
    };

    getReq();
    setSelectedItem(item.id);
    localStorage.setItem("groupId", groupId);
  };

  const handleSocket = async (obj) => {
    const groupId = obj.id;
    const token = localStorage.getItem("token");
    const response = await axios.get(`${PORT}/getUsers` + groupId, {
      headers: {
        Authorization: token,
      },
    });
    const newObj = {
      groupInfo: obj,
      userInfo: response.data.allUserIds,
    };
    socket.emit("group create", newObj);
  };

  const allListItems = messages.map((item, index) => {
    const inputString = item.name;
    const messageSenderName = _.startCase(_.toLower(inputString));
    const state =
      messageSenderName ===
      _.startCase(_.toLower(localStorage.getItem("userName")))
        ? true
        : false;
    const msgClass = state ? classes.messagebox : classes.messagebox2;
    const styles = !state
      ? { width: "max-content", marginRight: "" }
      : { width: "50%", float: "right" };
    const timestamp = new Date(item.createdAt);
    const timeOnly = timestamp.toISOString().substr(11, 5);
    const senderClass = !state ? classes.senderName : classes.receiverName;

    const imgHandler = (item) => {
      setImgUrl(item.fileUrl);
      setImageShow(!imageShow);
    };
    return (
      <ListGroup.Item
        key={index}
        variant={index % 2 === 0 ? "" : "secondary"}
        style={{ backgroundColor: "transparent", margin: "0", border: 0 }}
      >
        <div className={msgClass} style={styles}>
          <div className={senderClass}>
            <p>{messageSenderName}</p>
          </div>

          <Row>
            <Col>
              {item.fileUrl && (
                <img
                  src={item.fileUrl}
                  width={200}
                  height={200}
                  alt="Uploaded"
                  onClick={() => imgHandler(item)}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <p style={{userSelect:"text"}}>{item.message}</p>
            </Col>
          </Row>
          <Row>
            <small className={classes.timestamp}>{timeOnly}</small>
          </Row>
        </div>
      </ListGroup.Item>
    );
  });
  const oneGroupHandler = async (item) => {
    setSelectedItem(item.id);
    const groupId = localStorage.getItem("groupId");
  };
  const allmembers = Allusers.map((item) => {
    return (
      <ListGroup.Item
        key={item.id}
        action
        variant="info"
        onClick={() => {
          oneGroupHandler(item);
        }}
      >
        <IoPerson /> {item.name}
      </ListGroup.Item>
    );
  });
  const allGroupListItems = groupItem.map((item) => {
    const classState = selectedItem === item.id;

    return (
      <ListGroup.Item
        key={item.id}
        variant={selectedItem === item.id ? "dark" : "light"}
        className={classState}
        onClick={() => {
          listGroupHandler(item);
        }}
      >
        <HiUserGroup /> {item.name}
      </ListGroup.Item>
    );
  });
  const handleImgModal = () => {
    setImageShow(!imageShow);
  };
  return (
    <Fragment>
      <Imagemodal
        imgurl={imgurl}
        handleClose={handleImgModal}
        show={imageShow}
      />
      <div className={classes.container}>
        <div className={classes.container1}>
          <Mainheaderelement handleSocket={handleSocket} />
          <div className={classes.scrollableList}>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                variant="light"
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
              {/* {allmembers} */}
            </ListGroup>
          </div>
        </div>
        <div className={classes.listbox}>
          <Headelement
            userArray={usersPresent}
            state={isAdmin}
            groupName={groupName}
          />
          <div className={classes.scrollableList} ref={listRef}>
            {allListItems.length > 0 && <ListGroup>{allListItems}</ListGroup>}
            {allListItems.length === 0 && <p>No messages are present</p>}
          </div>
          <footer className={classes.footer}>
            <Inputbox sendToParent={changeStateHandler} />
          </footer>
        </div>
      </div>
    </Fragment>
  );
};

export default Mainpage;
