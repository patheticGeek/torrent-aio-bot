const axios = require("axios");
const dev = process.env.NODE_ENV !== "production";
const site = dev ? require("../config").site : process.env.SITE;

function keepalive() {
  if (site) {
    setInterval(async () => {
      const data = await axios(
        `https://ping-pong-sn.herokuapp.com/pingback?link=${site}`
      );
      console.log("keep alive triggred, status: ", data.status);
    }, 1560000);
  } else {
    console.warn("SITE enviorment variable not defined. Read docs.");
  }
}

module.exports = keepalive;
