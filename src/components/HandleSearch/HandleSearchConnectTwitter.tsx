import React, { useContext, useState } from "react";

import { useTwitter } from "../../hooks/twitter";
import { HandleMintContext } from "../../context/handleSearch";

export const HandleSearchConnectTwitter = () => {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const { twitter } = useContext(HandleMintContext);
    const [handleConnectTwitter] = useTwitter();

    if (twitter) {
        return null;
    }

    return (
        <div className="text-center">
            {isConnecting
                ? <p className="text-lg">Authenticating your reserved handle...</p>
                : (
                    <p className="text-lg">
                        If you reserved a handle with Twitter, <button className="text-primary-100" onClick={async () => {
                            setIsConnecting(true);
                            await handleConnectTwitter();
                            setIsConnecting(false);
                        }}>unlock it here</button>.
                    </p>
                )
            }
        </div>
    );
}