const NavArrow = ({ arrowHandler, direction }) => {
  if (direction === "left-arrow") {
    return <svg xmlns="http://www.w3.org/2000/svg" onClick={arrowHandler} className={direction} width="7vw" height="7vh" fill="white" viewBox="7 5 6 9.99">
      <path id="left-arrow" fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillOpacity="75%"></path>
    </svg>
  }
  if (direction === "right-arrow") {
    return <svg xmlns="http://www.w3.org/2000/svg" onClick={arrowHandler} className={direction} fill="white" width="7vw" height="7vh" viewBox="7 5.01 6 9.99">
      <path id="right-arrow" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillOpacity="75%"></path>
    </svg>
  }
};

export default NavArrow;