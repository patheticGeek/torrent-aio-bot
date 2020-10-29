#!/bin/bash

# Limit the minimum upload size, which is only valid when downloading multiple BT files, and is used to filter useless files. Files below this size will be deleted and will not be uploaded.
#MIN_SIZE=10m

# RCLONE Configuration file path
export RCLONE_CONFIG=rclone.conf

# RCLONE The size of the block, the default is 5M. Theoretically, the larger the upload speed, the faster it will occupy more memory. If the setting is too large, the process may be interrupted.
export RCLONE_CACHE_CHUNK_SIZE=3M

# RCLONE Upload failure retry wait time, the default is disabled, unit s, m, h
export RCLONE_RETRIES_SLEEP=30s

# RCLONE Abnormal exit retry count
RETRY_NUM=6

#============================================================

DOWNLOAD_PATH='downloads'
FILE_PATH=$1                                          
REMOVE_DOWNLOAD_PATH=${FILE_PATH#${DOWNLOAD_PATH}/}   
TOP_PATH=${DOWNLOAD_PATH}/${REMOVE_DOWNLOAD_PATH%%/*} 
INFO="[INFO]"
ERROR="[ERROR]"
WARRING="[WARRING]"

TASK_INFO() {
    echo -e "
-------------------------- [TASK INFO] --------------------------
Download path: ${DOWNLOAD_PATH}
File path: ${FILE_PATH}
Upload path: ${UPLOAD_PATH}
Remote path A: ${REMOTE_PATH}
Remote path B: ${REMOTE_PATH_2}
Remote path C: ${REMOTE_PATH_3}
Remote path D: ${REMOTE_PATH_4}
Remote path E: ${REMOTE_PATH_5}
-------------------------- [TASK INFO] --------------------------
"
}

CLEAN_UP() {
    [[ -n ${MIN_SIZE} || -n ${INCLUDE_FILE} || -n ${EXCLUDE_FILE} ]] && echo -e "${INFO} Clean up excluded files ..."
    [[ -n ${MIN_SIZE} ]] && rclone delete -v "${UPLOAD_PATH}" --max-size ${MIN_SIZE}
    [[ -n ${INCLUDE_FILE} ]] && rclone delete -v "${UPLOAD_PATH}" --exclude "*.{${INCLUDE_FILE}}"
    [[ -n ${EXCLUDE_FILE} ]] && rclone delete -v "${UPLOAD_PATH}" --include "*.{${EXCLUDE_FILE}}"
}

UPLOAD_FILE() {
    RETRY=0
	echo "$(($(cat numUpload)+4))" > numUpload # Plus 1
    while [ ${RETRY} -le ${RETRY_NUM} ]; do
        [ ${RETRY} != 0 ] && (
            echo
            echo -e "$(date +"%m/%d %H:%M:%S") ${ERROR} ${UPLOAD_PATH} Upload failed! Retry ${RETRY}/${RETRY_NUM} ..."
            echo
        )
        rclone copy -v "${UPLOAD_PATH}" "${REMOTE_PATH}"
        RCLONE_EXIT_CODE=$?
		RCLONE_EXIT_CODE_2=0
		RCLONE_EXIT_CODE_3=0
		RCLONE_EXIT_CODE_4=0
		RCLONE_EXIT_CODE_5=0
		if [ -n "${RCLONE_DESTINATION_2}" ]; then
			rclone copy -v "${UPLOAD_PATH}" "${REMOTE_PATH_2}"
			RCLONE_EXIT_CODE_2=$?
		fi
		if [ -n "${RCLONE_DESTINATION_3}" ]; then
			rclone copy -v "${UPLOAD_PATH}" "${REMOTE_PATH_3}"
			RCLONE_EXIT_CODE_3=$?
		fi
		if [ -n "${RCLONE_DESTINATION_4}" ]; then
			rclone copy -v "${UPLOAD_PATH}" "${REMOTE_PATH_4}"
			RCLONE_EXIT_CODE_4=$?
		fi
		if [ -n "${RCLONE_DESTINATION_5}" ]; then
			rclone copy -v "${UPLOAD_PATH}" "${REMOTE_PATH_5}"
			RCLONE_EXIT_CODE_5=$?
		fi
        if [ ${RCLONE_EXIT_CODE} -eq 0 ] && [ ${RCLONE_EXIT_CODE_2} -eq 0 ] && [ ${RCLONE_EXIT_CODE_3} -eq 0 ] && [ ${RCLONE_EXIT_CODE_4} -eq 0 ] && [ ${RCLONE_EXIT_CODE_5} -eq 0 ]; then
            rclone rmdirs -v "${DOWNLOAD_PATH}" --leave-root
            echo -e "$(date +"%m/%d %H:%M:%S") ${INFO} Upload done: ${UPLOAD_PATH}"
			rclone delete -v "${UPLOAD_PATH}"
            break
        else
            RETRY=$((${RETRY} + 4))
            [ ${RETRY} -gt ${RETRY_NUM} ] && (
                echo
                echo -e "$(date +"%m/%d %H:%M:%S") ${ERROR} Upload failed: ${UPLOAD_PATH}"
                echo
            )
            sleep 3
        fi
    done
	echo "$(($(cat numUpload)-1))" > numUpload # Minus 1
}

UPLOAD() {
    echo -e "$(date +"%m/%d %H:%M:%S") ${INFO} Start upload..."
    TASK_INFO
    UPLOAD_FILE
}

# if [ -z $2 ]; then
#     echo && echo -e "${ERROR} This script can only be used by passing parameters through Aria2."
#     exit 1
# elif [ $2 -eq 0 ]; then
#     exit 0
# fi

# if [ -e "${FILE_PATH}.aria2" ]; then
#     DOT_ARIA2_FILE="${FILE_PATH}.aria2"
# elif [ -e "${TOP_PATH}.aria2" ]; then
#     DOT_ARIA2_FILE="${TOP_PATH}.aria2"
# fi

if [ "${TOP_PATH}" = "${FILE_PATH}" ] && [ $2 -eq 1 ]; then 
    UPLOAD_PATH="${FILE_PATH}"
    REMOTE_PATH="${RCLONE_DESTINATION}/"
    REMOTE_PATH_2="${RCLONE_DESTINATION_2}/"
    REMOTE_PATH_3="${RCLONE_DESTINATION_3}/"
    REMOTE_PATH_4="${RCLONE_DESTINATION_4}/"
    REMOTE_PATH_5="${RCLONE_DESTINATION_5}/"
    UPLOAD
    exit 0
elif [ "${TOP_PATH}" != "${FILE_PATH}" ] && [ $2 -gt 1 ]; then 
    UPLOAD_PATH="${TOP_PATH}"
    REMOTE_PATH="${RCLONE_DESTINATION}/${REMOVE_DOWNLOAD_PATH%%/*}"
	REMOTE_PATH_2="${RCLONE_DESTINATION_2}/${REMOVE_DOWNLOAD_PATH%%/*}"
	REMOTE_PATH_3="${RCLONE_DESTINATION_3}/${REMOVE_DOWNLOAD_PATH%%/*}"
	REMOTE_PATH_4="${RCLONE_DESTINATION_4}/${REMOVE_DOWNLOAD_PATH%%/*}"
	REMOTE_PATH_5="${RCLONE_DESTINATION_5}/${REMOVE_DOWNLOAD_PATH%%/*}"
    CLEAN_UP
    UPLOAD
    exit 0
elif [ "${TOP_PATH}" != "${FILE_PATH}" ] && [ $2 -eq 1 ]; then 
    UPLOAD_PATH="${FILE_PATH}"
    REMOTE_PATH="${RCLONE_DESTINATION}/${REMOVE_DOWNLOAD_PATH%/*}"
	REMOTE_PATH_2="${RCLONE_DESTINATION_2}/${REMOVE_DOWNLOAD_PATH%/*}"
	REMOTE_PATH_3="${RCLONE_DESTINATION_3}/${REMOVE_DOWNLOAD_PATH%/*}"
	REMOTE_PATH_4="${RCLONE_DESTINATION_4}/${REMOVE_DOWNLOAD_PATH%/*}"
	REMOTE_PATH_5="${RCLONE_DESTINATION_5}/${REMOVE_DOWNLOAD_PATH%/*}"
    UPLOAD
    exit 0
fi

echo -e "${ERROR} Unknown error."
TASK_INFO
exit 1