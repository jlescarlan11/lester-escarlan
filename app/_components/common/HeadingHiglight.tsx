import React, { PropsWithChildren } from "react";

const HeadingHiglight = ({ children }: PropsWithChildren) => {
  return (
    <div className="font-mono text-xs text-muted-foreground mt-2">
      {children}
    </div>
  );
};

export default HeadingHiglight;
