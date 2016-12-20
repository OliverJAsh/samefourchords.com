#!/bin/bash

npm install
if [ -f pgid ]; then kill -TERM -`cat pgid` && rm -rf pgid; fi
{ PORT=8081 npm start & }
echo $! > pgid
cat pgid
