import React, { FC, useState } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

interface Form {
    status: string;
    message?: string;
    subscribe: (formData) => void;
    onSubmit: (formData) => void;
}

const Form: FC<Form> = ({ onSubmit, subscribe, message, status }): JSX.Element => {
    const [checked, setChecked] = useState<boolean>(false);
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            const hasEmail = data.get('email');
            hasEmail && subscribe(data);
        }}>
            <div className="grid grid-cols-2">
                <div className="grid-span-1">
                    <input type="email" name="email" className="mailchimp-email block w-full px-4 py-4 rounded-l-lg border-r-0 outline-primary-200 focus:outline-none" placeholder="hello@example.com" />
                </div>
                <div className="grid-span-1">
                    <input type="submit" disabled={!checked} className={`${checked ? 'cursor-pointer hover:bg-dark-100 focus:bg-dark-100 hover:shadow-lg' : 'cursor-not-allowed'} form-input m-0 block py-4 px-6 bg-primary-100 text-white text-center rounded-r-lg inline-block font-bold h-full`} value="Join the Waitlist" />
                </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
                <input id="gdpr" type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                <label className="ml-2" htmlFor="gdpr">I agree to recieve marketing emails.</label>
            </div>
            {message}
        </form>
    )
}

const MailchimpForm = (): JSX.Element => (
    <MailchimpSubscribe
        url={''}
        render={({ subscribe, status, message }) => (
            <div>
            <Form subscribe={subscribe} status={status} message={message} />
            {status === "sending" && <div style={{ color: "blue" }}>sending...</div>}
            {status === "error" && <div style={{ color: "red" }} dangerouslySetInnerHTML={{__html: message}}/>}
            {status === "success" && <div style={{ color: "green" }}>Subscribed !</div>}
            </div>
        )}
    />
)

export default MailchimpForm;