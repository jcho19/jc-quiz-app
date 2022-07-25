import { createContext, useState } from 'react';

export const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState('');

    return (
        <TokenContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </TokenContext.Provider>
    )
}

