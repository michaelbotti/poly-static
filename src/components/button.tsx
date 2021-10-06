import React, { FC } from "react";
import { Link } from "gatsby";

interface ButtonProps {
  buttonStyle?: "primary" | "secondary" | "link";
  internal?: boolean;
  href?: string;
  className?: string;
  [key: string]: unknown;
}

export const Button: FC<ButtonProps> = ({
  className = "",
  href,
  internal = true,
  buttonStyle = "secondary",
  children,
  ...rest
}): JSX.Element => {
  const classes = [
    "cursor-pointer hover:shadow-lg m-0 py-4 px-6 text-center rounded-lg inline-block font-bold",
  ];

  switch (buttonStyle) {
    case "primary":
      classes.push("bg-primary-200 hover:bg-dark-100 active:bg-dark-100 text-dark-100 hover:text-white active:text-white");
    case "secondary":
    default:
      classes.push("bg-primary-100 hover:bg-dark-100 active:bg-dark-100 text-white");
  }

  if (internal && href?.length) {
    return (
      <Link to={href} className={classes.join(" ") + " " + className} {...rest}>
        {children}
      </Link>
    );
  }

  if (!internal && href?.length) {
    return (
      <a href={href} className={classes.join(" ") + " " + className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes.join(" ") + " " + className} {...rest}>
      {children}
    </button>
  );
};

export default Button;
