import React from "react";

import SEO from "../components/seo";
import { HandleSearchForm } from "../components/HandleForm/HandleSearchForm";

function MintPage() {
  return (
    <>
      <SEO title="Home" />
      <HandleSearchForm />
    </>
  );
}

export default MintPage;
