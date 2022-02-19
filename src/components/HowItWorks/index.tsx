import { Link } from "gatsby";
import React from "react";

export const HowItWorks = () => {
  return (
    <div className="col-span-12 md:col-span-6">
      <div className="shadow-lg rounded-lg border-2 border-primary-100 p-4 md:p-8">
        <h3 className="text-white text-3xl font-bold text-center mb-4">
          How it Works
        </h3>
        <p className="text-lg text-center text-dark-350">
          Purchasing a Handle is a 4-step process, starting with:
        </p>
        <ol className="mb-4">
          <li>Enter the queue to save your place in line.</li>
          <li>Wait for an access code when it's your turn.</li>
          <li>Click the link when it arrives and agree to terms.</li>
          <li>Search and select an available Handle to purchase.</li>
        </ol>
        <p>
          Pricing for each Handle ranges from 10 $ADA to 500 $ADA, depending on
          the character length. You can see full details on{" "}
          <Link to="/faq" className="text-primary-100">
            our FAQ page
          </Link>
          !
        </p>
      </div>
    </div>
  );
};
