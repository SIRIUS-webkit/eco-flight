import React, { PropsWithChildren } from "react";

const MaxWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return <div className="max-w-[1220px] mx-auto lgmx:mx-5">{children}</div>;
};

export default MaxWrapper;
