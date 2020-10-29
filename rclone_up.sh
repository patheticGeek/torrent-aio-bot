#!/bin/bash

toppath=$1

LIGHT_GREEN_FONT_PREFIX="\033[1;32m"
FONT_COLOR_SUFFIX="\033[0m"
INFO="[${LIGHT_GREEN_FONT_PREFIX}INFO${FONT_COLOR_SUFFIX}]"

echo -e "$(date +"%m/%d %H:%M:%S") ${INFO} Uploading to rclone started!"
echo -e "Path is:"
echo -e "$toppath"


TASK_INFO() {
    echo -e "
-------------------------- [TASK INFO] --------------------------
Download path: ${toppath}
Upload path: ${UPLOAD_PATH}
Remote path A: ${RCLONE_DESTINATION}
Remote path B: ${RCLONE_DESTINATION_2}
Remote path C: ${RCLONE_DESTINATION_3}
Remote path D: ${RCLONE_DESTINATION_4}
Remote path E: ${RCLONE_DESTINATION_5}
Remote path F: ${RCLONE_DESTINATION_6}
Remote path G: ${RCLONE_DESTINATION_7}
Remote path H: ${RCLONE_DESTINATION_8}
Remote path I: ${RCLONE_DESTINATION_9}
Remote path J: ${RCLONE_DESTINATION_10}
-------------------------- [TASK INFO] --------------------------
"
}

echo -e "Starting Upload!"
if [ -n "${RCLONE_DESTINATION}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION}"
    echo -e "Uploaded to ${RCLONE_DESTINATION} successfully"
fi

if [ -n "${RCLONE_DESTINATION_2}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_2}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_2} successfully"
fi

if [ -n "${RCLONE_DESTINATION_3}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_3}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_3} successfully"
fi

if [ -n "${RCLONE_DESTINATION_4}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_4}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_4} successfully"
fi

if [ -n "${RCLONE_DESTINATION_5}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_5} successfully"
fi

if [ -n "${RCLONE_DESTINATION_6}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_6} successfully"
fi

if [ -n "${RCLONE_DESTINATION_7}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_7} successfully"
fi

if [ -n "${RCLONE_DESTINATION_8}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_8} successfully"
fi

if [ -n "${RCLONE_DESTINATION_9}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_9} successfully"
fi

if [ -n "${RCLONE_DESTINATION_10}" ]; then
    rclone -v --config="rclone.conf" copy "$topPath" "${RCLONE_DESTINATION_5}"
    echo -e "Uploaded to ${RCLONE_DESTINATION_10} successfully"
fi

echo -e "Tasks Done!"
