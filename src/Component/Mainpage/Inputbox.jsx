import { Fragment, useRef } from "react";
import classes from "./Inputbox.module.css";
import axios from "axios";
const Inputbox = (props) => {
  const chatRef = useRef();
  const sendHandler = (event) => {
    event.preventDefault();
    const enteredMessage = chatRef.current.value;
    const token = localStorage.getItem("token");
    const postMessage = async () => {
      try {
        const groupId = localStorage.getItem("groupId")||null;
        console.log(groupId);
      const response=  await axios.post(
          "http://localhost:5000/add-message",
          { message: enteredMessage, groupId: groupId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        chatRef.current.value = "";
        // console.log(response.data.data)
        props.sendToParent(response.data.data)
      } catch (err) {
        alert(err);
        
      }
    };
    postMessage();
  };

  return (
    <Fragment>
      <div className={classes.box1}>
        <form onSubmit={sendHandler}>
          <input type="text" ref={chatRef} required />
          <button type="submit">Send</button>
        </form>
      </div>
    </Fragment>
  );
};

export default Inputbox;
