const Footer = (props) => {
  return (
    <div { ...props } className={`tailor-footer ${props.className}`}>
      {props.children}
    </div>
  );
};

export default Footer;
