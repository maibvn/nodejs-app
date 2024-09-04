import React from "react";
import classes from "./Footer.module.css";

const FooterItem = ({ title, children }) => {
  return (
    <div>
      <div className={classes.title}>{title}</div>
      {children.map((e, i) => {
        return (
          <div key={i}>
            <a
              href="#"
              className={classes.footerItem}
              style={{ textDecoration: "none" }}
            >
              {e}
            </a>
          </div>
        );
      })}
    </div>
  );
};
export default FooterItem;
