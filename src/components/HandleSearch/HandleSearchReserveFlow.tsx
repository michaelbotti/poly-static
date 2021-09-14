import React from 'react';
import { Link } from 'gatsby';

import { HandleSearchForm } from './';

export const HandleSearchReserveFlow = (): JSX.Element => {
    return (
        <>
            <h2 className="font-bold text-3xl text-primary-100 mb-2">
                Securing Your Handle
            </h2>
            <p className="text-lg">
            Purchasing your own handle allows you to easily receive Cardano payments just by sharing your handle name, or by sharing your unique link.
            </p>
            <p className="text-lg">
            For more information, see <Link className="text-primary-100" to={'/how-it-works'}>How it Works</Link>.
            </p>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <HandleSearchForm />
        </>
    );
}