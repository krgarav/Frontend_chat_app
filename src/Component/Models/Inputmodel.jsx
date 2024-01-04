import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
const PORT = import.meta.env.VITE_REACT_PORT;

const Inputmodal = (props) => {
  const [slectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const chatRef = useRef(null);
 
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredMessage = chatRef.current.value;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", slectedFile);
    console.log(slectedFile);
    const postMessage = async () => {
      try {
        const groupId = localStorage.getItem("groupId") || null;
        let url = null;
        if (slectedFile) {
          const config = {
            headers: { "content-type": "multipart/form-data" },
          };
          const uploadFile = await axios.post(
            `${PORT}/fileupload`,
            formData,
            config
          );
          url = await uploadFile.data.data;
        }
        const response = await axios.post(
          `${PORT}/add-message`,
          { message: enteredMessage, fileUrl: url, groupId: groupId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        props.sendSocket(response.data.data);
        props.changeCross();
        setSelectedFile(null);
        props.handleClose();
        if (chatRef.current) {
          chatRef.current.value = "";
        }
        chatRef.current.focus();
      } catch (err) {
        alert(err);
      }
    };
    F;
    postMessage();
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={submitHandler}>
            {slectedFile && (
              <div>
                <img
                  src={URL.createObjectURL(slectedFile)}
                  alt="Selected File"
                  width="200px"
                  height="200px"
                />
              </div>
            )}
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <span>
              <input type={"text"} ref={chatRef} placeholder="Type message" />

              <button type="submit" disabled={!slectedFile ? true : false}>
                Send
              </button>
            </span>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Inputmodal;
