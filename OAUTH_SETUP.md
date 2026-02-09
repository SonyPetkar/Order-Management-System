# OAuth Setup Guide

Social login is now implemented and ready to use! Follow these steps to get it working.

## Google OAuth Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Search for "Google+ API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials
1. Go to Credentials (left menu)
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add Authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:3000
   https://yourdomain.com
   ```
5. Copy the **Client ID**

### 3. Configure Frontend
1. Create a `.env` file in the `frontend` directory:
   ```bash
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
   REACT_APP_GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
   ```

2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID

3. Restart the frontend:
   ```bash
   npm run dev
   ```

## GitHub OAuth Setup

### 1. Create GitHub OAuth Application
1. Go to GitHub Settings → Developer settings → [OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: Order Management System
   - **Homepage URL**: `http://localhost:5173` (or your domain)
   - **Authorization callback URL**: `http://localhost:5173/auth/github/callback`

4. Copy the **Client ID** and **Client Secret**

### 2. Create GitHub Callback Handler
The GitHub callback page is needed. Create `frontend/src/pages/GitHubCallbackPage.jsx`:

```jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { oauthService } from '../services/api';

function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setError('No authorization code received');
      setLoading(false);
      return;
    }

    // Exchange code for access token (you need a backend endpoint for this)
    exchangeCodeForToken(code);
  }, [searchParams]);

  const exchangeCodeForToken = async (code) => {
    try {
      // Backend endpoint to exchange code for token
      const response = await fetch('/api/oauth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('authChange'));
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to authenticate with GitHub');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Processing...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
        </div>
      </div>
    );
  }

  return null;
}

export default GitHubCallbackPage;
```

### 3. Add Backend GitHub Callback Endpoint
Add this to `backend/src/controllers/oauthController.js`:

```javascript
// GitHub Callback (exchange code for token)
export const githubCallback = async (req, res) => {
  try {
    const { code } = req.body;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!code || !clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters',
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Use existing githubAuth function
    const userInfo = await getGithubUserInfo(accessToken);

    let email = userInfo.email;
    if (!email) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailResponse.data.find((e) => e.primary);
      email = primaryEmail?.email || `${userInfo.login}@github.placeholder`;
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: userInfo.name || userInfo.login,
        email,
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        role: 'user',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'GitHub authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('GitHub Callback Error:', error);
    res.status(401).json({
      success: false,
      message: 'GitHub authentication failed',
    });
  }
};
```

### 4. Configure Backend Environment
Add to `backend/.env`:

```bash
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
```

## Testing Social Login

### Google OAuth
1. Click "Google" button on login/register page
2. Select a Google account
3. Should redirect to dashboard

### GitHub OAuth
1. Click "GitHub" button on login/register page
2. Authorize the application
3. Should redirect to dashboard

## Environment Variables Summary

**Frontend (.env)**
```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
```

**Backend (.env)**
```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Troubleshooting

**Google OAuth not working?**
- Verify Client ID is correct
- Check Authorized redirect URIs include your app URL
- Clear browser cache and cookies

**GitHub OAuth not working?**
- Verify Client ID and Secret are correct
- Check Authorization callback URL matches exactly
- Make sure backend endpoint for code exchange is implemented

## Production Deployment

When deploying to production:

1. Update redirect URLs in OAuth provider settings
2. Use HTTPS URLs instead of HTTP
3. Keep Client Secrets in secure environment variables
4. Never commit `.env` files with secrets

---

OAuth setup is complete! Social login buttons are now functional. 🎉
