import axios from 'axios';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_OAUTH_BASE = 'https://www.linkedin.com/oauth/v2';
export const getLinkedInAuthUrl = (redirectUri, state) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const scope = 'r_liteprofile r_emailaddress w_member_social';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });
  return `${LINKEDIN_OAUTH_BASE}/authorization?${params.toString()}`;
};
export const getLinkedInAccessToken = async (code, redirectUri) => {
  try {
    const response = await axios.post(
      `${LINKEDIN_OAUTH_BASE}/accessToken`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
      scope: response.data.scope
    };
  } catch (error) {
    throw new Error(`Failed to get LinkedIn access token: ${error.message}`);
  }
};
export const getLinkedInProfile = async (accessToken) => {
  try {
    const response = await axios.get(`${LINKEDIN_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    const profile = response.data;
    return {
      id: profile.id,
      firstName: profile.localizedFirstName,
      lastName: profile.localizedLastName,
      profilePicture: profile.profilePicture?.displayImage || null,
      headline: profile.headline,
      vanityName: profile.vanityName,
      profileUrl: `https://www.linkedin.com/in/${profile.vanityName}`
    };
  } catch (error) {
    throw new Error(`Failed to fetch LinkedIn profile: ${error.message}`);
  }
};
export const getLinkedInEmail = async (accessToken) => {
  try {
    const response = await axios.get(
      `${LINKEDIN_API_BASE}/emailAddress?q=members&projection=(elements*(handle~))`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const emailData = response.data.elements[0]['handle~'];
    return emailData.emailAddress;
  } catch (error) {
    throw new Error(`Failed to fetch LinkedIn email: ${error.message}`);
  }
};
export const verifyLinkedInUrl = (profileUrl) => {
  const patterns = [
    /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)\/?$/,
    /^linkedin\.com\/in\/([a-zA-Z0-9-]+)\/?$/,
    /^\/in\/([a-zA-Z0-9-]+)\/?$/,
    /^([a-zA-Z0-9-]+)$/
  ];
  for (const pattern of patterns) {
    const match = profileUrl.match(pattern);
    if (match) {
      const username = match[match.length - 1];
      return {
        isValid: true,
        username,
        fullUrl: `https://www.linkedin.com/in/${username}`
      };
    }
  }
  return {
    isValid: false,
    username: null,
    fullUrl: null,
    error: 'Invalid LinkedIn profile URL format'
  };
};
export const getLinkedInPublicProfile = async (profileUrl) => {
  const validation = verifyLinkedInUrl(profileUrl);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  return {
    profileUrl: validation.fullUrl,
    username: validation.username,
    isValid: true,
    note: 'Full profile data requires OAuth authentication'
  };
};
export const validateAndStoreLinkedInProfile = (profileUrl) => {
  const validation = verifyLinkedInUrl(profileUrl);
  if (!validation.isValid) {
    throw new Error('Invalid LinkedIn profile URL. Please provide a valid LinkedIn profile link.');
  }
  return {
    profileUrl: validation.fullUrl,
    username: validation.username,
    linkedAt: new Date().toISOString()
  };
};
export const refreshLinkedInToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${LINKEDIN_OAUTH_BASE}/accessToken`,
      null,
      {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token
    };
  } catch (error) {
    throw new Error(`Failed to refresh LinkedIn token: ${error.message}`);
  }
};
export const getLinkedInCompleteProfile = async (accessToken) => {
  try {
    const [profile, email] = await Promise.all([
      getLinkedInProfile(accessToken),
      getLinkedInEmail(accessToken).catch(() => null)
    ]);
    return {
      ...profile,
      email,
      connectedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to fetch complete LinkedIn profile: ${error.message}`);
  }
};
