import { Fragment } from "react";
import Inputbox from "./Inputbox";
import classes from "./Mainpage.module.css";
import { ListGroup } from "react-bootstrap";

const Mainpage = () => {
  return (
    <Fragment>
      <div className={classes.container}>
        <h1>Chat App</h1>
        <div className={classes.listbox}>
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
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
