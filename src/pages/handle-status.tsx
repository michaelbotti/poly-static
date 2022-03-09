import React from "react";
import { HandleStatus } from "../components/HandleStatus";

import SEO from "../components/seo";

function HandleStatusPage() {
  return (
    <>
      <SEO title="Handle Status" />
      <section id="top" className="max-w-5xl mx-auto">
        <HandleStatus />
      </section>
    </>
  );
}

export default HandleStatusPage;
