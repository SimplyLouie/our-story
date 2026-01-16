# Firebase Authentication Setup Guide

## ✅ What's Been Implemented

Your wedding website now has **Firebase Authentication** integrated! Here's what's been added:

### 🔐 **1. Firebase Authentication**
- **Email/Password Login**: Secure admin access using Firebase Auth
- **Google Sign-In**: Easy one-click access for authorized Gmail accounts
- **Admin Allowlist**: Restrict access to specific email addresses only
- **Session Persistence**: Auto-login on page refresh
- **Logout Functionality**: Proper sign-out when closing admin panel
- **Error Handling**: Specific error messages for unauthorized access or auth failures

### 🎵 **2. Enhanced Music Selector**
- **Curated Tracks**: 4 predefined wedding music options with icons
- **Custom URL**: Add your own music URL
- **Preview Player**: Test tracks before saving (5-second preview)
- **Visual Feedback**: See currently selected track with status indicator
- **Easy Removal**: Remove music with one click

---

## 🚀 Setup Instructions

### **Step 1: Enable Email/Password Authentication in Firebase**

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Select your project: **simply-louie**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. **Enable** Email/Password (Leave Email link disabled)
6. Click **Save**

### **Step 1.5: Enable Google Sign-In**

1. In **Authentication** → **Sign-in method**, click **Add new provider**
2. Select **Google**
3. Click **Enable**
4. Set the **Project support email** (use your primary email)
5. Click **Save**
6. *Note: You don't need to configure anything else for the free tier.*

### **Step 2: Create Admin User**

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - **Email**: `admin@simplylouie.com` (or your preferred email)
   - **Password**: Create a strong password (min. 6 characters)
4. Click **Add User**

### **Step 3: Test the Login**

1. Open your wedding website
2. Click the **Admin** icon in the navbar
3. Enter the credentials you just created:
   - Email: `admin@simplylouie.com`
   - Password: `your-password`
4. Click **Sign In**

---

## 🎉 Features

### **Admin Panel Access**
- **Secure Login**: Email/password authentication
- **Auto-login**: Stay logged in across sessions
- **Logout**: Automatic logout when closing admin panel

### **Music Selector**
- **4 Curated Tracks**:
  - 🎹 Romantic Piano
  - 🎻 Classical Romance
  - 🎸 Acoustic Love
  - 🎵 Elegant Strings
- **Custom URL input** for your own tracks
- **Preview button** to test audio (5 seconds)
- **Current selection indicator**
- **Remove button** to clear music

---

### **Admin Access: The Allowlist**
Your website now uses an **Allowlist** for security. Only the following emails can access the Admin Panel:

1. `admin@simplylouie.com` (Requires Password)
2. `mendezlouie892@gmail.com` (Google Login)
3. `louie.mendez@guesty.com` (Google Login)
4. `faciolflorie.mae03@gmail.com` (Google Login)

If anyone else logs in with a Google account, they will be automatically denied access and signed out.

---

## 🔧 Advanced: Add More Admin Users

To add more admins (e.g., wedding planner, partner):

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **Add User**
3. Create credentials for the new admin
4. Share credentials securely (not via text/email)

---

## 🎵 Music Selector Tips

### **Finding Music URLs**

**Option 1: YouTube to MP3**
1. Find your song on YouTube
2. Use a YouTube to MP3 converter (search "youtube to mp3")
3. Download and upload to cloud storage
4. Get the direct link

**Option 2: Cloud Storage**
1. Upload your MP3 to Google Drive or Dropbox
2. Get shareable link
3. Convert to direct download link:
   - **Google Drive**: Use services like "gdrive direct link generator"
   - **Dropbox**: Change `?dl=0` to `?dl=1` at the end of the URL

**Option 3: Audio Hosting**
- Use services like SoundCloud, Mixcloud (get direct file link)
- Or dedicated audio hosting services

### **Test Before Publishing**
Always click the **Preview** button to test the audio before saving!

---

## 📧 Support

If you need help:
1. Check Firebase Console for any error messages
2. Verify your Firebase config in `firebase-config.ts`
3. Make sure Email/Password auth is enabled in Firebase
4. Check browser console for detailed error logs

---

## 🎊 That's It!

Your wedding website now has:
- ✅ Secure Firebase Authentication
- ✅ Beautiful music selector
- ✅ Enhanced admin panel with all features
- ✅ Elegant "Louie & Florie" hero font

Enjoy managing your wedding website! 💒💍
