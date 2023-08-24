import { Fragment, useRef, useState } from "react";
import classes from "./Inputbox.module.css";
import axios from "axios";
import ReactPlayer from "react-player";
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
        // chatRef.current.value = "";
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
          <div>{/* <label htmlFor="fileInput">Select File: </label> */}</div>
          <input type="text" ref={chatRef} required />
          <button type="submit">Send</button>
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ color: "white" }}
          />
          {/* <img src="https://expensetracker1213.s3.amazonaws.com/IMG_20221013_200714%20copy-removebg-preview.jpg" width={200} height={200}/> */}

          {/* <video controls width="640" height="360">
            <source  src="https://expensetracker1213.s3.ap-south-1.amazonaws.com/001+Module+Introduction.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
          {/* <ReactPlayer url="https://expensetracker1213.s3.ap-south-1.amazonaws.com/001+Module+Introduction.mp4" controls={true} width="640px" height="360px" /> */}
        </form>
      </div>
    </Fragment>
  );
};

export default Inputbox;
