import React from "react";
import FooterItem from "./FooterItem";
import classes from "./Footer.module.css";

const DUMMY_DATA = [
  {
    title: "Customer Service",
    children: [
      "Help & Contact Us",
      "Returns & Refunds",
      "Online Store",
      "Terms & Conditions",
    ],
  },
  {
    title: "Company",
    children: ["What We Do", "Available Services", "Latest Posts", "FAQs"],
  },
  {
    title: "Social Media",
    children: ["Twitter", "Instagram", "Facebook", "Pinterest"],
  },
];

const Footer = () => {
  return (
    <footer className={classes.grid}>
      {DUMMY_DATA.map((row, i) => {
        return <FooterItem title={row.title} children={row.children} key={i} />;
      })}
    </footer>
  );
};
export default Footer;
