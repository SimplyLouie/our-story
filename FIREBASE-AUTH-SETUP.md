# Firebase Authentication Setup Guide

## ✅ What's Been Implemented

Your wedding website now has **Firebase Authentication** integrated! Here's what's been added:

### 🔐 **1. Firebase Authentication**
- **Email/Password Login**: Secure admin access using Firebase Auth
- **Session Persistence**: Auto-login on page refresh
- **Logout Functionality**: Proper sign-out when closing admin panel
- **Error Handling**: Specific error messages for different auth failures

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
5. **Enable** both:
   - ✅ Email/Password
   - ❌ Email link (passwordless sign-in) - Leave disabled
6. Click **Save**

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

## 📝 Important Notes

### **Security**
- Never share your Firebase admin credentials
- Use a strong password (combination of letters, numbers, symbols)
- Consider enabling **Multi-factor Authentication** in Firebase later

### **Music URLs**
- Must be direct links to audio files (.mp3, .ogg, .wav)
- Use services like Google Drive, Dropbox (with direct links), or audio hosting
- Test the URL in preview before saving

### **Backup Admin Access**
- If you forget your password, use **Firebase Console** → **Authentication** → **Users** → Reset password
- Or create a new admin user from Firebase Console

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
