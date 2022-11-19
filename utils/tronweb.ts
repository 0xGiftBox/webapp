const TronWeb = require("tronweb");

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

let tronWeb: typeof TronWeb;

if (typeof window !== "undefined" && typeof window.tronWeb !== "undefined") {
  //We are in the browser and running metamusk
  tronWeb = window.tronWeb;
} else {
  //We are on the server or the user is not running metamask
  tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
  tronWeb.setAddress(process.env.TRONWEB_ADDRESS);
}
export default tronWeb;
