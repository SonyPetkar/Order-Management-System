# OAuth Troubleshooting Guide

## Error: "The OAuth client was not found" / "Error 401: invalid_client"

This means your OAuth credentials are either:
1. Invalid or expired
2. Not configured with the correct redirect URIs
3. Not enabled in the cloud console

---

## Quick Diagnostic Steps

### For Google OAuth:

1. **Verify Client ID Format**
   - Valid format: `XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`
   - Your current: Check in `.env` file

2. **Check Google Cloud Console**
   - Go to https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID
   - Click it to view details

3. **Verify Authorized Redirect URIs**
   - Should include at least:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - If missing, add them and save

4. **Verify Google+ API is Enabled**
   - Go to https://console.cloud.google.com/apis/library
   - Search for "Google+ API"
   - Click it and verify "Status: Enabled"

### For GitHub OAuth:

1. **Verify Settings**
   - Go to https://github.com/settings/developers
   - Click on your OAuth App
   - Check "Authorization callback URL" - should be:
     ```
     http://localhost:5173/auth/github/callback
     ```
   - Or for Vite dev server:
     ```
     http://localhost:5173
     ```

2. **Test Client ID Exists**
   - Copy Client ID and Client Secret from the app page
   - Make sure they're not expired

---

## Solution: Create Fresh Credentials

### Create New Google OAuth Credentials (5 minutes):

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create Project** (if you don't have one):
   - Click project selector (top left)
   - Click "NEW PROJECT"
   - Name: "Order Management System"
   - Create

3. **Enable Google+ API**:
   - Go to APIs & Services → Library
   - Search "Google+ API"
   - Click it → "ENABLE"

4. **Create OAuth Credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Set name: "Order Management"
   - Add Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:5173
     http://localhost:3000/callback
     ```
   - Click CREATE
   - Copy the **Client ID** (not secret)

5. **Update `.env` file**:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
   ```

### Create New GitHub OAuth App (3 minutes):

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: Order Management System
   - **Homepage URL**: http://localhost:5173
   - **Authorization callback URL**: http://localhost:5173

4. Click "Register application"
5. Copy **Client ID** (not secret for now)
6. Update `.env`:
   ```
   REACT_APP_GITHUB_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
   ```

---

## Testing

After updating `.env`:

1. **Restart frontend dev server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)

3. **Test Google OAuth**:
   - Go to login page
   - Click Google button
   - You should see account selection

4. **Test GitHub OAuth**:
   - Go to login page
   - Click GitHub button
   - Should redirect to GitHub authorization page

---

## Common Issues

| Error | Solution |
|-------|----------|
| "Client ID not found" | Check Client ID spelling in `.env` |
| Redirect URI mismatch | Add `http://localhost:5173` to authorized URIs |
| Connection refused | Check backend is running on port 5000 |
| Invalid_client | Client ID doesn't exist or is invalid |

---

## If Still Not Working

Try this minimal test:
1. Use a fresh OAuth credential (create new one from scratch)
2. Make sure `npm run dev` shows `http://localhost:5173`
3. Check `.env` file has no extra spaces:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_ID_HERE
   ```
   Not:
   ```
   REACT_APP_GOOGLE_CLIENT_ID = YOUR_ID_HERE
   ```

4. Verify backend is running (separate terminal):
   ```bash
   cd backend
   npm run dev
   ```

Let me know which step fails and I can help debug!
