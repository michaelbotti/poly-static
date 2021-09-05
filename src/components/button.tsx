import React, { FC } from 'react';
import { Link } from 'gatsby';

interface ButtonProps {
    style?: 'primary' | 'secondary' | 'link',
    internal: boolean;
    href?: string;
    className: string;
}

const classes = 'cursor-pointer bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 hover:shadow-lg m-0 py-4 px-6 text-white text-center rounded-lg inline-block font-bold';

const Button: FC<ButtonProps> = ({ className = '', href, internal = true, style = 'primary', children, ...rest }): JSX.Element => {
    if (internal && href?.length) {
        return <Link to={href} className={classes + ' ' + className} {...rest}>{children}</Link>
    }

    if (!internal && href?.length) {
        return <a href={href} className={classes + ' ' + className} {...rest}>{children}</a>
    }

    return <button className={classes + ' ' + className} {...rest}>{children}</button>
}

export default Button;