<<<<<<< HEAD
# manfess-mobile2
=======

# Manfess Mobile - Team Git Setup Guide

This guide ensures every team member can push, pull, and clone the repository without running into permission issues.

---

## 1. Install Git
Make sure Git is installed on your machine:

- **Windows**: [Download Git](https://git-scm.com/download/win)  
- **Mac**: `brew install git`  
- **Linux**: `sudo apt install git` (Debian/Ubuntu) or `sudo yum install git` (RHEL/CentOS)  

Check Git version:

```bash
git --version

2. Configure GitHub Authentication

Set your Git username and email (must match your GitHub account):

git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

3. Generate an SSH Key

Generate a new SSH key pair (if you don’t have one):

ssh-keygen -t ed25519 -C "your-email@example.com"


Press Enter to accept the default location (~/.ssh/id_ed25519).

Enter a passphrase for security (optional).

Your key files:

Private key: ~/.ssh/id_ed25519

Public key: ~/.ssh/id_ed25519.pub

4. Add SSH Key to GitHub

Copy your public key:

cat ~/.ssh/id_ed25519.pub


Go to GitHub → Settings → SSH and GPG keys

Click New SSH key

Paste the key and give it a title (e.g., "Work Laptop")

Click Add SSH key

5. Test SSH Connection
ssh -T git@github.com


Expected output:

Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.


Type yes if prompted about authenticity.

6. Set Repository Remote to SSH

Clone the repo:

git clone git@github.com:vildashnetwork/manfess-mobile.git


Or switch remote URL in an existing repo:

git remote set-url origin git@github.com:vildashnetwork/manfess-mobile.git


Check remote:

git remote -v

7. Commit and Push Workflow
a. Add changes
git add .

b. Commit changes
git commit -m "Your commit message"

c. Push to main branch
git push -u origin main


After the first push, you can simply use:

git push

8. Useful Git Commands

Check branch: git branch

Switch branch: git checkout branch-name

Create new branch: git checkout -b branch-name

Pull latest changes: git pull

See changes: git status

View history: git log --oneline --graph --all

9. Notes

Always use SSH for pushing to avoid 403 Permission Denied errors.

Make sure you are on the correct branch before committing.

Avoid committing sensitive files like .env by using .gitignore.
>>>>>>> 3f8968e54c295c7d94009aa69c084f3f8263f520
