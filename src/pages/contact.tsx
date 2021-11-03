import React from "react";

import SEO from "../components/seo";
import { Link } from "gatsby";
import Button from "../components/button";

function ContactPage() {
  return (
    <>
      <SEO title="Contact" />
      <section id="contact" className="lg:my-8 lg:my-16 max-w-3xl mx-auto">
        <section className="mb-8 lg:mt-16 lg:mb-32 max-w-xl mx-auto">
          <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
            Contact
          </h2>
          <p className="text-lg">Most questions can be answered by browsing our <Link to={'/faq'} className="text-primary-100">FAQ's</Link>. If your question is not answered there, you can use the
          form below, and we'll get back to you in 3-5 business days.</p>
        </section>
        <div className="my-16 max-w-3xl mx-auto">
          <div className="p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <form name="contact" method="POST" data-netlify="true">
              <p>
                <label>Your Name: <input className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-3xl w-full`} type="text" name="name" /></label>
              </p>
              <p>
                <label>Your Email: <input className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-3xl w-full`} type="email" name="email" /></label>
              </p>
              <p>
                <label>
                  How Can We Help You?
                  <select name="type" className="mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-xl w-full">
                    <option value="general" defaultChecked>General Inquery</option>
                    <option value="refund">I Need a Refund</option>
                    <option value="press">Press</option>
                    <option value="claim">Claim Handle</option>
                  </select>
                </label>
              </p>
              <p>
                <label>Your Message: <textarea className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-3xl w-full`} name="message"></textarea></label>
              </p>
              <p>
                <Button type="submit">Send</Button>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
