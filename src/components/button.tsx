import React, { FC } from "react";
import { Link } from "gatsby";

interface ButtonProps {
  style?: "primary" | "secondary" | "link";
  internal: boolean;
  href?: string;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  className = "",
  href,
  internal = true,
  style = "secondary",
  children,
  ...rest
}): JSX.Element => {
  const classes = [
    "cursor-pointer hover:shadow-lg m-0 py-4 px-6 text-center rounded-lg inline-block font-bold",
  ];

  switch (style) {
    case "primary":
      classes.push("bg-primary-200 hover:bg-dark-100 focus:bg-dark-100 text-dark-100");
    case "secondary":
    default:
      classes.push("bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 text-white");
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
