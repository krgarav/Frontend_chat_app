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
    const getChats = async () => {
      const response = await axios.get("http://localhost:3000/get-message", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.chats);
      setMessages(response.data.chats);
    };
    getChats();
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
