#!/bin/sh
preface="### Based on commit $(git rev-parse HEAD | cut -c1-7), made $(date "+%d/%m %H:%M") UTC\n## Commits this release"
list="$(git log --pretty="format:%s" | grep -m 1 -B 100 "\[Release Prep\]" | head -n -1 | awk '$0="  - "$0')"

echo -en "$preface\n$list" > dist/devChangelog.md