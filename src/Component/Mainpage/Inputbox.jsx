import { Fragment, useRef, useState } from "react";
import classes from "./Inputbox.module.css";
import PropTypes from 'prop-types';
import axios from "axios";
const Inputbox = (props) => {
  const [slectedFile, setSelectedFile] = useState(null);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const sendHandler = (event) => {
    event.preventDefault();
    const enteredMessage = chatRef.current.value;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", slectedFile);
    const postMessage = async () => {
      try {
        const groupId = localStorage.getItem("groupId") || null;
        let url = null;
        if (slectedFile) {
          const config = {
            headers: { "content-type": "multipart/form-data" },
          };
          const uploadFile = await axios.post(
            "http://localhost:5000/fileupload",
            formData,
            config
          );
          url = await uploadFile.data.data;
        }
        const response = await axios.post(
          "http://localhost:5000/add-message",
          { message: enteredMessage, fileUrl: url, groupId: groupId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        props.sendToParent(response.data.data);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (chatRef.current) {
          chatRef.current.value = "";
        }
      } catch (err) {
        alert(err);
      }
    };
    postMessage();
  };
  // console.log(slectedFile);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <Fragment>
      <div className={classes.box1}>
        <form onSubmit={sendHandler}>
          <input
            placeholder="Enter Message"
            type="text"
            ref={chatRef}
            required
          />
          <button type="submit">Send</button>
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ color: "white" }}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Inputbox;
Inputbox.propTypes = {
  sendToParent: PropTypes.func.isRequired,
  
};