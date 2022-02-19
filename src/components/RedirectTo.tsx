import React from "react";

interface Props {
  to: string;
}

export const RedirectTo: React.FC<Props> = ({ to }) => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.location = to;
  }

  return null;
};
