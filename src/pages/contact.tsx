import React, { useMemo, useState } from "react";

import SEO from "../components/seo";
import { Link } from "gatsby";
import Button from "../components/button";

interface FormState {
  name: string;
  email: string;
  message: string;
  type: 'general' | 'refund' | 'press' | 'claim';
}

function encode(data) {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
}

function ContactPage() {
  const [state, setState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    type: 'general'
  })
  const [success, setSuccess] = useState<boolean>(null);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": e.target.getAttribute("name"),
        ...state
      })
    })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false));
  }

  const isValid = useMemo(() => {
    if (state.name.length === 0) {
      return false;
    }

    if (state.email.length === 0) {
      return false;
    }

    if (state.message.length === 0) {
      return false;
    }

    return true;
  }, [state])

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
            {true === success && <p className="text-2xl">Success! We received your inquery and will get back to you as soon as possible.</p>}
            {false === success && <p className="text-2xl">Something went wrong. Please try emailing founder@adahandle.com for help.</p>}
            {null === success && (
              <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
                <p>
                  <label>Your Name: <input onChange={e => handleChange(e)} className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-3xl w-full`} type="text" name="name" /></label>
                </p>
                <p>
                  <label>Your Email: <input onChange={e => handleChange(e)} className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-3xl w-full`} type="email" name="email" /></label>
                </p>
                <p>
                  <label>
                    How Can We Help You?
                    <select name="type" onChange={e => handleChange(e)} className="mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-xl w-full">
                      <option value="general" defaultChecked>General Inquery</option>
                      <option value="refund">I Need a Refund</option>
                      <option value="press">Press</option>
                      <option value="claim">Claim Handle</option>
                    </select>
                  </label>
                </p>
                <p>
                  <label>Your Message: <textarea onChange={e => handleChange(e)} className={`mt-2 focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg px-6 py-4 text-lg w-full`} name="message"></textarea></label>
                </p>
                <input type="hidden" name="contact" value="contact" />
                <p>
                  <Button disabled={!isValid} type="submit">Send</Button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
