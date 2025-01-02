import React from "react";

export const Hidden = ({ data, name }) => {
  return <input type="hidden" value={data[name] || ""} />;
};
