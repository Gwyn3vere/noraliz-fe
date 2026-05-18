import React from "react";

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

export default React.memo(ContentWrapper);
