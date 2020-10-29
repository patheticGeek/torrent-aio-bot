#!/bin/bash

# Install rclone static binary
wget -q https://downloads.rclone.org/v1.51.0/rclone-v1.51.0-linux-amd64.zip
unzip -q rclone-v1.51.0-linux-amd64.zip
export PATH=$PWD/rclone-v1.51.0-linux-amd64:$PATH

if [[ -n $RCLONE_CONFIG && -n $RCLONE_DESTINATION ]]; then
	echo "Rclone config detected"
	echo -e "$RCLONE_CONFIG" > rclone.conf
	chmod +x rclone_up.sh
fi

node index.js
