import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import classes from "./Info.module.css";
import Button from "../Button";

const Information = () => {
  //Homepage Infor
  return (
    <div className={classes.info}>
      <Container
        className={`${classes.infoContainer}  justify-content-center `}
      >
        <Row>
          <Col lg={4}>
            <div className={classes.text}>Free Shipping</div>
            <div className={classes.des}>Free shipping worldwide</div>
          </Col>
          <Col lg={4}>
            <div className={classes.text}>24 X 7 service</div>
            <div className={classes.des}>Free shipping worldwide</div>
          </Col>
          <Col lg={4}>
            <div className={classes.text}>Festival Offer</div>
            <div className={classes.des}>Free shipping worldwide</div>
          </Col>
        </Row>
      </Container>

      <Container className={classes.contact}>
        <Row>
          <Col lg={6}>
            <div className={classes.contactText}>Let's be friends</div>
            <div className={classes.des}>
              Nisi nisi tempor consequat laboris nisi.
            </div>
          </Col>
          <Col lg={6}>
            <div
              className={`d-flex align-items-center ${classes.inputContainer}`}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <Button>Subscribe</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Information;
