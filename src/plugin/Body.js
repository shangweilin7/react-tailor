const Body = (props) => {
  return (
    <div { ...props } className={`tailor-body ${props.className}`}>
      {props.children}
    </div>
  );
};

export default Body;
