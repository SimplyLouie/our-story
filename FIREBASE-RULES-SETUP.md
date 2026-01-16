# 🔥 Firebase Database Rules Setup Guide

## 📋 Overview

This guide will help you set up secure Firebase Realtime Database rules for your wedding website.

---

## 🎯 Security Rules Summary

### What Each Rule Does:

| Data Path | Read Access | Write Access | Purpose |
|-----------|-------------|--------------|---------|
| `/content` | ✅ Everyone | 🔒 Admin only | Website content (dates, text, images, music) |
| `/rsvps` | ✅ Everyone | ✅ Everyone | Guest RSVPs (guests need to submit) |
| `/notes` | 🔒 Admin only | 🔒 Admin only | Private planning notes |
| `/guestbook` | ✅ Everyone | ✅ Everyone | Public guest messages |

---

## 🚀 Method 1: Firebase Console (Easiest)

### **Step-by-Step Instructions:**

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project: **simply-louie**

2. **Navigate to Database Rules**
   - Click **Realtime Database** in the left sidebar
   - Click the **Rules** tab at the top

3. **Copy & Paste Rules**
   - Delete ALL existing rules
   - Copy the rules below and paste them:

```json
{
  "rules": {
    "content": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["lastModified"]
    },
    "rsvps": {
      ".read": true,
      ".write": true,
      "$rsvpId": {
        ".validate": "newData.hasChildren(['id', 'name', 'email', 'status'])"
      },
      ".indexOn": ["status", "timestamp", "name"]
    },
    "notes": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$noteId": {
        ".validate": "newData.hasChildren(['id', 'content', 'date'])"
      },
      ".indexOn": ["date"]
    },
    "guestbook": {
      ".read": true,
      ".write": true,
      "$entryId": {
        ".validate": "newData.hasChildren(['id', 'name', 'message', 'date'])"
      },
      ".indexOn": ["date"]
    }
  }
}
```

4. **Publish the Rules**
   - Click the **Publish** button in the top right
   - You should see: ✅ "Rules published successfully"

5. **Test It**
   - Refresh your wedding website
   - Log into the admin panel
   - Try making a change (the permission errors should be gone!)

---

## 🚀 Method 2: Firebase CLI (Advanced)

If you prefer using the command line:

### **1. Install Firebase CLI** (if not already installed)

```bash
npm install -g firebase-tools
```

### **2. Login to Firebase**

```bash
firebase login
```

### **3. Initialize Firebase** (in your project folder)

```bash
cd /Users/louie.mendez/Downloads/wedding-project
firebase init database
```

- Select: **Use an existing project**
- Choose: **simply-louie**
- File: `database.rules.json` (already created!)

### **4. Deploy Rules**

```bash
firebase deploy --only database
```

You'll see:
```
✔ Deploy complete!
```

---

## 🔒 Security Features Explained

### **1. Content Protection**
```json
"content": {
  ".read": true,           // Anyone can view wedding details
  ".write": "auth != null" // Only logged-in admins can edit
}
```

### **2. RSVP Flexibility**
```json
"rsvps": {
  ".read": true,  // Everyone can see RSVPs
  ".write": true  // Guests can submit their RSVPs
}
```

### **3. Data Validation**
```json
".validate": "newData.hasChildren(['id', 'name', 'email', 'status'])"
```
This ensures RSVPs always have required fields.

### **4. Performance Indexing**
```json
".indexOn": ["status", "timestamp", "name"]
```
Makes filtering and sorting RSVPs faster.

---

## ✅ Verify Rules Are Working

### **After Publishing:**

1. **Open Browser Console** (F12)
2. **Refresh your wedding site**
3. **Check for errors:**
   - ❌ Before: `PERMISSION_DENIED: Permission denied`
   - ✅ After: No permission errors!

4. **Test Admin Functions:**
   - Log into admin panel
   - Edit some content
   - Add a timeline event
   - Upload a gallery image
   - Should all work without errors! 🎉

---

## 🛡️ Security Best Practices

### **Current Setup:**
- ✅ Public can view wedding details (content, RSVPs, guestbook)
- ✅ Guests can submit RSVPs and guestbook entries
- ✅ Only authenticated admins can edit content and notes
- ✅ Data validation prevents malformed entries

### **Optional: More Restrictive Rules**

If you want ONLY admins to see RSVPs and guestbook:

```json
{
  "rules": {
    "content": {
      ".read": true,
      ".write": "auth != null"
    },
    "rsvps": {
      ".read": "auth != null",  // Changed: Only admin can view
      ".write": true
    },
    "notes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "guestbook": {
      ".read": "auth != null",  // Changed: Only admin can view
      ".write": true
    }
  }
}
```

---

## 🐛 Troubleshooting

### **Still seeing permission errors?**

1. **Check Database URL**
   - Open `firebase-config.ts`
   - Verify `databaseURL` matches your Firebase project

2. **Verify Auth is Working**
   - Make sure you created the admin user in Firebase Console
   - Email: `admin@simplylouie.com`
   - Try logging in

3. **Clear Browser Cache**
   - Hard refresh: `Cmd + Shift + R` (Mac)
   - Or clear all Firebase cached data

4. **Check Rules in Console**
   - Firebase Console → Realtime Database → Rules
   - Make sure they're published (check timestamp)

---

## 📊 Monitor Database Activity

### **View Real-Time Data:**
1. Firebase Console → Realtime Database → **Data** tab
2. You'll see all your data organized:
   ```
   ├── content/
   ├── rsvps/
   ├── notes/
   └── guestbook/
   ```

### **Check Usage:**
1. Firebase Console → Realtime Database → **Usage** tab
2. Monitor:
   - Storage used
   - Bandwidth
   - Connections

---

## 🎉 Next Steps

After setting up rules:

1. ✅ **Test Admin Panel** - Make sure you can edit content
2. ✅ **Test RSVP Form** - Submit a test RSVP as a guest
3. ✅ **Check Guestbook** - Add a test message
4. ✅ **Create Admin User** - In Firebase Auth (if not done)

---

## 📞 Need Help?

If you're still having issues:

1. Check browser console for specific errors
2. Verify Firebase project is correctly configured
3. Make sure Authentication is enabled
4. Ensure Realtime Database is created

---

**You're all set! Your Firebase Database is now secure and ready for your wedding! 💒**
