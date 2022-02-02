import React from "react";

export const Closed = (): JSX.Element => {
  return (
    <div
      className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
      style={{ minHeight: "10vh" }}
    >
      <div className="col-span-12">
        <h3 className="text-primary-100 font-bold text-4xl text-center mb-2">
          SPO Portal Closed For Maintenance
        </h3>
      </div>
    </div>
  );
};
