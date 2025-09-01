🚀 Git Workflow Guide for manfess-web
1️⃣ Clone the Repository

First time only – download the project to your computer:
# ssh -T git@github.com

# git clone git@github.com:vildashnetwork/manfess-web.git
# cd manfess-web

2️⃣ Check the Status of Your Repo

See what has changed:

# git status

3️⃣ Pull Latest Changes (ALWAYS do this before starting work)
# git pull origin main

4️⃣ Create a New Branch (recommended)

Keep your work separate from main:

# git checkout -b feature-branch-name

5️⃣ Stage Changes

Add modified files to be committed:

# git add .


or add specific files:

# git add filename.js

6️⃣ Commit Changes

Save your staged changes locally with a message:

# git commit -m "Describe what you changed"

7️⃣ Push Changes to GitHub

If working on a branch:

# git push origin feature-branch-name


If pushing directly to main (⚠️ not recommended unless urgent):

# git push origin main

8️⃣ Switch Branches
# git checkout main

9️⃣ Merge Branch into Main

When your branch is done and reviewed:

# git checkout main
# git pull origin main
# git merge feature-branch-name
# git push origin main

🔁 Other Useful Commands

View branches:

git branch


Delete a branch (after merging):

# git branch -d feature-branch-name


See commit history:

# git log --oneline


✅ Workflow Recommendation

Always git pull origin main before starting work.

Use feature branches for new work.

Commit often with meaningful messages.

Push your branch and make a Pull Request on GitHub for review.



# Stage specific files
* git add index.js .gitignore  

# OR stage everything that changed
* git add .

# Commit with a message
* git commit -m "Update index.js and .gitignore"

🔹 Push Changes to GitHub
 # Push to the remote 'main' branch
* git push origin main



🔹 Pull Latest Changes from GitHub
# Fetch and merge changes from remote
git pull origin main

🔹 Check Repo Status
git status   # see changes
git log      # see commit history

🔹 Cancel or Undo Things
# Undo all unstaged changes (go back to last commit)
git restore .

# Unstage a file
git restore --staged <filename>

# Reset the last commit (keep changes in working directory)
git reset --soft HEAD~1

# Reset the last commit and remove changes
git reset --hard HEAD~1

🔹 Work with Branches
# Create a new branch
git checkout -b feature-branch

# Switch branch
git checkout main

# Push a branch
git push origin feature-branch

# Delete a local branch
git branch -d feature-branch


⚡ In your case, to push your .gitignore and index.js changes, just run:

git add .
git commit -m "Updated index.js and .gitignore"
git push origin main