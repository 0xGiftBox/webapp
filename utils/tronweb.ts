const TronWeb = require("tronweb");

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

const getTronWeb = () => {
  if (typeof window !== "undefined" && typeof window.tronWeb !== "undefined") {
    //We are in the browser and running metamusk
    return window.tronWeb;
  } else {
    //We are on the server or the user is not running metamask
    let tronweb = new TronWeb(fullNode, solidityNode, eventServer);
    tronweb.setAddress(process.env.NEXT_PUBLIC_TRONWEB_ADDRESS);
    return tronweb;
  }
};
export default getTronWeb;
