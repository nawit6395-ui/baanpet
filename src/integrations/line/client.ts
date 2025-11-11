import axios from 'axios';

const CHANNEL_ID = '2008462283';
const CHANNEL_SECRET = '938c55f553840d85d2e1159ccfb297e7';
const REDIRECT_URI = `${window.location.origin}/auth/line/callback`;

// Function to initiate LINE login
export const initiateLineLogin = () => {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('line_state', state);
    
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=profile%20openid`;
    window.location.href = lineLoginUrl;
};

// Function to handle the callback from LINE
export const handleLineCallback = async (code: string, state: string) => {
    try {
        const savedState = sessionStorage.getItem('line_state');
        if (state !== savedState) {
            throw new Error('State mismatch. Possible CSRF attack.');
        }

        const response = await axios.post('https://api.line.me/oauth2/v2.1/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CHANNEL_ID,
            client_secret: CHANNEL_SECRET,
        });

        const accessToken = response.data.access_token;
        const idToken = response.data.id_token;

        // Use the access token to fetch user information
        const userInfoResponse = await axios.get('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        sessionStorage.removeItem('line_state');

        return {
            ...userInfoResponse.data,
            accessToken: accessToken,
            idToken: idToken,
        };
    } catch (error) {
        console.error('Error during LINE login:', error);
        throw error;
    }
};
