#!/bin/bash

echo "------- Commit generated static app. -------"

git config --global user.name "ELDevBot"
git config --global user.email engagementlab@emerson.edu

git remote set-url origin https://$GH_TOKEN@github.com/engagementlab/transform-narratives.git
git add ./client/out/*
git commit --message "Automated generated static production app (GH action #$GHA_RUNNUM) [skip ci]"

git pull
git commit --message "Merge branch 'main' of github.com:engagementlab/transform-narratives into main [skip ci]"
git push