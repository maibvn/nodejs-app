export const generateImgLinks = (path) => {
  const isAbsolutePath = path.startsWith("data");
  if (isAbsolutePath) {
    const formattedPath = `${process.env.REACT_APP_API_URL}/${path.replace(
      /\\/g,
      "/"
    )}`;
    return formattedPath;
  } else {
    return path;
  }
};
