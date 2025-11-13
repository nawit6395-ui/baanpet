import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID || '';
const REDIRECT_URI = `${window.location.origin}/auth/line/callback`;

// Function to initiate LINE login
export const initiateLineLogin = () => {
    if (!CHANNEL_ID) {
        throw new Error('LINE Channel ID is not configured');
    }

    const state = Math.random().toString(36).substring(7);
    const nonce = Math.random().toString(36).substring(7);
    sessionStorage.setItem('line_state', state);
    sessionStorage.setItem('line_nonce', nonce);
    
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=profile%20openid%20email&nonce=${nonce}`;
    window.location.href = lineLoginUrl;
};

// Function to handle the callback from LINE
export const handleLineCallback = async (code: string, state: string) => {
    try {
        const savedState = sessionStorage.getItem('line_state');
        if (state !== savedState) {
            throw new Error('State mismatch. Possible CSRF attack.');
        }

        // Call Supabase function to exchange code for token
        // This keeps the CHANNEL_SECRET safe on the backend
        const { data, error } = await supabase.functions.invoke('line-oauth-callback', {
            body: { 
                code: code,
                state: state,
                redirectUri: REDIRECT_URI,
            },
        });

        if (error) {
            throw new Error(`LINE callback error: ${error.message}`);
        }

        const accessToken = data.access_token;
        const idToken = data.id_token;
        const userInfo = data.userInfo;

        sessionStorage.removeItem('line_state');
        sessionStorage.removeItem('line_nonce');

        return {
            ...userInfo,
            accessToken: accessToken,
            idToken: idToken,
        };
    } catch (error) {
        console.error('Error during LINE login:', error);
        throw error;
    }
};
