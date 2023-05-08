const Button = ({ text, icon, isLoading, className, onClick, href, children }) => {
  const mainClass =
    className +
    " hover:shadow-xl hover:scale-105 flex text-center text-white rounded-xl p-3 mx-auto m-3 transition duration-100 transform ease-in-out box-shadow";

  return (
    <a
      className={mainClass}
      href={href}
      aria-disabled={isLoading}
      onClick={(e) => {
        if (e) e.preventDefault();
        onClick();
      }}
    >{children && children.length ? children  :
      <> {icon && <p className="mx-2 my-auto">{icon}</p>}
        <p className="mx-auto">{text}</p>
      </>}

    </a >
  );
};

Button.defaultProps = {
  onClick: () => { },
  href: "!#",
  isLoading: false,
};

export default Button;
