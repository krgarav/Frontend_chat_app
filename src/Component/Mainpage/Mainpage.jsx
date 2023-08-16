import { Fragment, useEffect, useState } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";

const Mainpage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const messages = JSON.parse(localStorage.getItem("messages"));
    const lastMessageId = messages[messages.length - 1].id;
    // if(messages){
    //   setMessages(messages);
    // }
    const getChats = async () => {
      const response = await axios.get(
        `http://localhost:3000/get-message?lastMessageId=${lastMessageId || 1}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const arrayData = await response.data.chats;
      const concatedArray = [...messages, ...arrayData];
      let slicedArray = [];
      if (concatedArray.length > 10) {
        slicedArray = concatedArray.slice(-10);
      } else {
        slicedArray = concatedArray;
      }
      const stringified = JSON.stringify(slicedArray);
      localStorage.setItem("messages", stringified);
      setMessages(slicedArray)
    };
    setInterval(() => {
      getChats();
    }, 1000);
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };
  return (
    <Fragment>
      <div className={classes.container}>
        <button onClick={logoutHandler}>Logout</button>
        <h1>Chat App</h1>
        <div className={classes.listbox}>
          <ListGroup>
            {messages.map((item, index) => (
              <ListGroup.Item
                key={index}
                variant={index % 2 === 0 ? "" : "secondary"}
              >
                 {item.message}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
      <footer className={classes.footer}>
        <Inputbox />
      </footer>
    </Fragment>
  );
};

export default Mainpage;
