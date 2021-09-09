import React, { FC, useMemo, useState, useRef } from 'react';

import { useRaritySlug, useRarityColor } from '../../hooks/nft';
import Background from '../../images/code.svg';
import Logo, { LogoFillTypes } from './logo';
import FullLogo from '../../images/logo-dark.svg';

interface NFTPreviewProps {
    handle: string;
}

const NFTPreview: FC<NFTPreviewProps> = ({ handle }) => {
    return (
        <div className="bg-dark-100 text-white relative overflow-hidden mx-auto w-96 h-96 max-w-full max-h-full">
            <img src={Background} className="w-7/8 w-3/4 bottom-0 transform translate-y-12 mr-4" />
            <div className="flex items-center justify-center absolute w-full h-full top-0 left-0">
                <img src={FullLogo} className="w-16 absolute top-6 left-6" />
                <p className="m-0 text-3xl w-3/4 text-center break-all font-bold">{handle || <span>&nbsp;</span>}</p>
                <Logo handle={handle} className="absolute top-6 right-6 w-12" />
                <p className="m-0 text-xs font-bold absolute bottom-6 right-6">adahandle.com</p>
            </div>
        </div>
    )
}

export default NFTPreview;