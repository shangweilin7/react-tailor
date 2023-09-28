const Header = (props) => {
  return (
    <div { ...props } className={`tailor-header ${props.className}`}>
      {props.children}
    </div>
  );
};

export default Header;
