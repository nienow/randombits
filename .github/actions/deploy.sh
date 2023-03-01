#!/bin/sh -l

set -e  # if a command fails exit the script
set -u  # script fails if trying to access an undefined variable

echo
echo "##### Starting #####"
SOURCE_FILES="$1"
DESTINATION_REPOSITORY="nienow/randombits"
DESTINATION_BRANCH="$2"
DESTINATION_DIRECTORY="$3"
COMMIT_USERNAME="system"
COMMIT_EMAIL="system@randombits.dev"

CLONE_DIRECTORY=$(mktemp -d)
FULL_DESTINATION="$CLONE_DIRECTORY/content/$DESTINATION_DIRECTORY"

echo
echo "##### Cloning source git repository #####"
# Setup git
git config --global user.email "$COMMIT_EMAIL"
git config --global user.name "$COMMIT_USERNAME"

echo
echo "##### Cloning destination git repository #####"

git clone --single-branch --branch "$DESTINATION_BRANCH" "https://$API_TOKEN_GITHUB@github.com/$DESTINATION_REPOSITORY.git" "$CLONE_DIRECTORY"
ls -la "$CLONE_DIRECTORY"

echo
echo "##### Copying contents to git repo #####"
rm -rvf "$FULL_DESTINATION"
mkdir -p "$FULL_DESTINATION"
cp -rvf $SOURCE_FILES "$FULL_DESTINATION"
cd "$CLONE_DIRECTORY"

echo
echo "##### Adding git commit #####"

git add .
git status

# don't commit if no changes were made
git diff-index --quiet HEAD || git commit --message "Update from $GITHUB_REPOSITORY - $GITHUB_SHA"

echo
echo "##### Pushing git commit #####"
# --set-upstream: sets the branch when pushing to a branch that does not exist
git push origin --set-upstream "$DESTINATION_BRANCH"
