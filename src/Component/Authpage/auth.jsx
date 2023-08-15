import { Fragment, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import classes from "./auth.module.css";
import axios from "axios";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
const Auth = () => {
  const [state, setState] = useState(false);
  const [show, setShow] = useState(true);
  const [resolve, setResolve] = useState(false);
  const enteredName = useRef();
  const enteredEmail = useRef();
  const enteredPassword = useRef();
  const enteredPhone = useRef();
  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    const postSignupdata = async () => {
      try {
        setResolve(true);
        const obj = {
          name: enteredName.current.value,
          email: enteredEmail.current.value,
          phone: enteredPhone.current.value,
          password: enteredPassword.current.value,
        };
        await axios.post("http://localhost:3000/user/signup", obj);
        alert("Signed up Successfully");
      } catch (err) {
        if (err.response) {
          alert(err.response.data.error);
        } else {
          alert(`Error: ${err.message}`);
        }
      }
      setResolve(false);
    };
    const postLogin = async () => {
      try {
        const obj = {
          email: enteredEmail.current.value,
          password: enteredPassword.current.value,
        };
        await axios.post("http://localhost:3000/user/login", obj);
        alert("Logged in Successfully");
        navigate("/chat-app");

      } catch (err) {
        if (err.response) {
          alert(err.response.data.error);
        } else {
          alert(err);
        }
      }
    };
    if (!state) {
      postSignupdata();
    } else {
      postLogin();
    }
  };
  const stateHandler = () => {
    if (state) {
      enteredEmail.current.value = "";
      enteredPassword.current.value = "";
    } else {
      enteredName.current.value = "";
      enteredEmail.current.value = "";
      enteredPhone.current.value = "";
      enteredPassword.current.value = "";
    }
    setState((prev) => !prev);
  };
  const hiddenBtnHandler = () => {
    setShow((prev) => !prev);
  };
  return (
    <Fragment>
      <main className={classes.parent}>
        <section className={classes.childBox}>
          <article className={classes.formBox}>
            <h3>{state ? "Login" : "Sign up"}</h3>
            <Form onSubmit={submitHandler}>
              {!state && (
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    ref={enteredName}
                    required
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  ref={enteredEmail}
                  required
                />
              </Form.Group>

              {!state && (
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    ref={enteredPhone}
                    required
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={show ? "password" : "text"}
                  placeholder="Password"
                  ref={enteredPassword}
                  required
                />
                <div
                  className={classes.hidebtn}
                  onClickCapture={hiddenBtnHandler}
                  // onMouseUp={hiddenBtnHandler}
                  // onMouseDown={hiddenBtnHandler}
                >
                  {show && <VscEyeClosed />}
                  {!show && <VscEye />}
                </div>
              </Form.Group>
              {state && <p className={classes.forgot}>Forgot Password ?</p>}

              {resolve && (
                <button className={classes.submitButton} type="submit" disabled>
                  <Spinner animation="border" />
                </button>
              )}
              {!resolve && (
                <button className={classes.submitButton} type="submit">
                  {state ? "Login" : "Sign up"}
                </button>
              )}
            </Form>
          </article>
          <aside className={classes.toggler}>
            <p onClick={stateHandler}>
              {state ? "New - User Signup ?" : "Existing user - Login"}
            </p>
          </aside>
        </section>
      </main>
    </Fragment>
  );
};
export default Auth;
