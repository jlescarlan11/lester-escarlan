import React, { PropsWithChildren } from "react";

const HeadingHiglight = ({ children }: PropsWithChildren) => {
  return <span>{children?.toString().toUpperCase()}</span>;
};

export default HeadingHiglight;
