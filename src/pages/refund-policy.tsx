import React from "react";

import SEO from "../components/seo";
import { REFUND_POLICY_DATE } from "../lib/constants";

function RefundPolicyPage() {
  return (
    <>
      <SEO title="Terms of Use" />
      <section className="mt-16 mb-32 max-w-xl mx-auto">
        <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
          Refund Policy
        </h2>
      </section>
      <section id="refund-policy" className="my-16 max-w-3xl mx-auto">
        <div className="p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
          <p>
            Refunds are handled in a specific manner, and are subject to the
            following:
          </p>
          <ul>
            <li>
              Refunds may take up to <strong>{REFUND_POLICY_DATE}</strong> to
              process.
            </li>
            <li>
              If you submit an inaccurate payment, those funds will be locked
              for up to {REFUND_POLICY_DATE}!
            </li>
            <li>
              Payments of under 2 ADA will <strong>NOT</strong> be refunded at
              all.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default RefundPolicyPage;
