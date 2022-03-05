import { Link } from "gatsby";
import React from "react";
import { Loader } from "../Loader";

interface Props {
  stateLoading: boolean;
  dynamicPricingEnabled: boolean;
}

export const HowItWorks: React.FC<Props> = ({
  stateLoading,
  dynamicPricingEnabled,
}) => {
  const renderDynamicPricingText = () => {
    if (stateLoading) {
      return (
        <div className="flex">
          <Loader className="text-center content-center" />
        </div>
      );
    }

    if (dynamicPricingEnabled) {
      return (
        <p>
          Pricing for each Handle, depending on the character length, uses our
          Stable-Pricing Model which is based on the current USD/ADA market
          price. You can see full details on{" "}
          <Link to="/faq" className="text-primary-100">
            our FAQ page
          </Link>
          !
        </p>
      );
    }

    return (
      <p>
        Pricing for each Handle ranges from 10 $ADA to 500 $ADA, depending on
        the character length. You can see full details on{" "}
        <Link to="/faq" className="text-primary-100">
          our FAQ page
        </Link>
      </p>
    );
  };

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
        {renderDynamicPricingText()}
      </div>
    </div>
  );
};
