import React from "react";

interface Props {
  savingSpot: boolean;
  emailInput: string;
  emailChecked: boolean;
  handleOnChange: (value: string) => void;
  setEmailChecked: (checked: boolean) => void;
}

export const EmailInputs: React.FC<Props> = ({
  savingSpot,
  emailInput,
  emailChecked,
  handleOnChange,
  setEmailChecked,
}) => {
  return (
    <>
      <input
        name="email"
        disabled={savingSpot}
        placeholder={"Your email address..."}
        className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 rounded-t-lg px-6 py-4 text-xl w-full`}
        value={emailInput}
        // @ts-ignore
        onChange={(e) => handleOnChange(e.target.value)}
      />
      <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 px-4 py-2">
        <input
          className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
          id="acceptEmail"
          name="acceptEmail"
          type="checkbox"
          checked={emailChecked}
          onChange={() => setEmailChecked(!emailChecked)}
        />
        <label
          className="ml-2 text-white py-3 cursor-pointer"
          htmlFor="acceptEmail"
        >
          I agree to receive email notifications.
        </label>
      </div>
    </>
  );
};
