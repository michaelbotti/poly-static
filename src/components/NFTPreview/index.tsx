import React, { FC, useContext } from 'react';
import { HandleMintContext } from '../../../src/context/handleSearch';

import Background from '../../images/code.svg';
import FullLogo from '../../images/logo-dark.svg';
import { HandleDetails } from '../HandleSearch';
import Logo from './logo';

interface NFTPreviewProps {
    handle: string;
}

const NFTPreview: FC<NFTPreviewProps> = ({ handle }) => {
    const { isPurchasing } = useContext(HandleMintContext);
    const textSize = () => {
        if (handle.length < 3) {
            return 'text-jumbo';
        }

        if (handle.length < 6) {
            return 'text-5xl';
        }

        return 'text-3xl';
    }

    return (
        <>
            {!isPurchasing && (
                <>
                    <p className="m-0 text-center">Your NFT Preview</p>
                    <div className="text-center mt-2 mb-8">
                        <HandleDetails />
                    </div>
                </>
            )}
            <div className="flex justify-center h-full w-full">
                <div className={`${handle.length > 0 ? '' : 'opacity-50'} bg-dark-100 text-white relative overflow-hidden mx-auto w-96 h-96 max-w-full max-h-full border border-2 border-dark-200 shadow-xl rounded-lg`}>
                    <img src={Background} className="w-7/8 w-3/4 bottom-0 transform translate-y-12 mr-4" />
                    <div className="flex items-center justify-center absolute w-full h-full top-0 left-0">
                        <img src={FullLogo} className="w-16 absolute top-6 left-6" />
                        <p className={`m-0 ${textSize()} w-3/4 text-center break-all font-bold leading-none`}>
                            {handle || <span>&nbsp;</span>}
                        </p>
                        <Logo handle={handle} className="absolute top-6 right-6 w-12" />
                        <p className="m-0 text-xs font-bold absolute bottom-6 right-6">adahandle.com</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NFTPreview;
