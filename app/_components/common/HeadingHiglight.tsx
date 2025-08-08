import React, { PropsWithChildren } from "react";

const HeadingHiglight = ({ children }: PropsWithChildren) => {
  return (
    <p className="font-mono text-xs text-muted-foreground mt-2">
      {children?.toString().toUpperCase()}
    </p>
  );
};

export default HeadingHiglight;
