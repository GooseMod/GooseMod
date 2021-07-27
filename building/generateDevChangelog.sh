#!/bin/sh
preface="## Commits this release"
list=git log --pretty="format:%s" | grep -m 1 -B 100 "\[Release Prep\]" | head -n -1 | awk '$0="  - "$0'

echo "$preface\n$list" > dist/devChangelog.md