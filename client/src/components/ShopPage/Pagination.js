import classes from "./Pagination.module.css";
const Pagination = ({ pageNum }) => {
  return (
    <>
      <div className={classes.pagination}>
        <a href="#">&laquo;</a>
        <a className={classes.active} href="#">
          1
        </a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">&raquo;</a>
        <p style={{ textAlign: "center" }}>Showing {pageNum} of 8 results</p>
      </div>
    </>
  );
};
export default Pagination;
