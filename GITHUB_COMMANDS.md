# GitHub Commands Reference Guide

This guide contains the most common Git commands you'll need for managing the **Louie & Florie Wedding Project**.

## 1. The "Daily Workflow" (Save & Upload)
Use this sequence to get your local changes live on GitHub:
```bash
# 1. Stage all your changes
git add .

# 2. Save your changes locally with a descriptive message
git commit -m "Your description of what you changed"

# 3. Upload your local saves to GitHub
git push origin main
```

---

## 2. Checking Status & History
Use these to see what's happening with your files:
```bash
# See which files you've modified or haven't saved yet
git status

# See a history of all your past commits
git log --oneline

# See exactly WHAT lines changed in your files before you save
git diff
```

---

## 3. Staying Up to Date
If you're working from another computer or want to download changes made elsewhere:
```bash
# Download and merge the latest changes from GitHub to your computer
git pull origin main
```

---

## 4. Undoing Mistakes
```bash
# Undo your last local commit but keep the code changes
git reset --soft HEAD~1

# Discard ALL unsaved changes in a specific file (revert to last save)
git restore <filename>

# Discard ALL unsaved changes in the entire project
git restore .
```

---

## 5. Managing Branches
```bash
# Create and switch to a new branch (e.g., "new-feature")
git checkout -b new-feature

# Switch back to the main branch
git checkout main

# Merge your finished feature back into main
git merge new-feature
```

> [!TIP]
> Always run `git status` before you commit. It's the best way to make sure you aren't accidentally saving files you didn't mean to!
