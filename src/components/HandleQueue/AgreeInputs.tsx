import React from "react";
import { Link } from "gatsby";
import { REFUND_POLICY_DATE } from "../../lib/constants";

interface Props {
  touChecked: boolean;
  setTouChecked: (checked: boolean) => void;
  refundsChecked: boolean;
  setRefundsChecked: (checked: boolean) => void;
}

export const AgreeInputs: React.FC<Props> = ({
  touChecked,
  setTouChecked,
  refundsChecked,
  setRefundsChecked,
}) => {
  return (
    <>
      <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-2 rounded-t-lg p-4 pt-2 pb-0">
        <input
          className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
          id="tou"
          name="tou"
          type="checkbox"
          checked={touChecked}
          onChange={() => setTouChecked(!touChecked)}
        />
        <label className="ml-2 text-white py-3 cursor-pointer" htmlFor="tou">
          I have read and agree to the ADA Handle{" "}
          <Link to="/tou" className="text-primary-100">
            Terms of Use
          </Link>
        </label>
      </div>
      <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 p-4 pb-2 pt-0">
        <input
          className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
          id="refunds"
          name="refunds"
          type="checkbox"
          checked={refundsChecked}
          onChange={() => setRefundsChecked(!refundsChecked)}
        />
        <label
          className="ml-2 text-white py-3 cursor-pointer"
          htmlFor="refunds"
        >
          You agree to our{" "}
          <Link className="text-primary-100" to="/refund-policy">
            Refund Policy
          </Link>{" "}
          and{" "}
          <strong className="underline">
            {REFUND_POLICY_DATE} processing time!
          </strong>
        </label>
      </div>
    </>
  );
};
