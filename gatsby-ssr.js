import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
    setHeadComponents([
        <script
            async
            key="recaptcha-script"
            src="https://www.google.com/recaptcha/api.js?render=6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP"
        />
    ])
}