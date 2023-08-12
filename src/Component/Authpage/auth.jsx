import { Fragment, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import classes from "./auth.module.css";
import axios from "axios";
const Auth = () => {
  const [state, setState] = useState(false);
  const enteredName = useRef();
  const enteredEmail = useRef();
  const enteredPassword = useRef();
  const enteredPhone = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    const obj = {
      name: enteredName.current.value,
      email: enteredEmail.current.value,
      phone: enteredPhone.current.value,
      password: enteredPassword.current.value,
    };
    const postSignupdata = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/user/signup",
          obj
        );
     
        // if(response.status===401){
        //   console.log(response.error.response.data.error)
        //   throw new Error(response.error.response.data.error)
        // }
        // console.log("this is:", response);
        alert("Signed up Successfully");
      } catch (err) {
        console.log(err);
        // alert(err.response.data.error);
        alert(err.response.data.error)
      }
    };
    postSignupdata();
    // console.log(obj);
  };
  const stateHandler = () => {
    setState((prev) => !prev);
  };
  return (
    <Fragment>
      <Fragment>
        <div className={classes.parent}>
          <div className={classes.childBox}>
            <div className={classes.formBox}>
              <h3>{state ? "Login" : "Signup"}</h3>
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
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    ref={enteredPhone}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={enteredPassword}
                    required
                  />
                </Form.Group>
                {state && <p className={classes.forgot}>Forgot Password ?</p>}
                <button className={classes.submitButton} type="submit">
                  {state ? "Login" : "Sign up"}
                </button>
              </Form>
            </div>
            <div className={classes.toggler}>
              <p onClick={stateHandler}>
                {state ? "New - User Signup ?" : "Existing user - Login"}
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    </Fragment>
  );
};
export default Auth;
