import { Fragment } from "react";
import classes from "./Inputbox.module.css";
const Inputbox = () => {
  return (
    <Fragment>
   
      <div className={classes.box1}>
        <input type="text" />
        <button>Send</button>
      </div>
    </Fragment>
  );
};

export default Inputbox;
