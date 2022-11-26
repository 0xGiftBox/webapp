const TronWeb = require("tronweb");

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

const getTronWeb = async () => {
  if (typeof window !== "undefined" && typeof window.tronLink !== "undefined") {
    //We are in the browser and running Tronlink

    let tronWeb;
    const tronLink = window.tronLink;
    if (tronLink.ready) {
      tronWeb = tronLink.tronWeb;
    } else {
      const res = await tronLink.request({ method: "tron_requestAccounts" });
      if (res.code === 200) {
        tronWeb = tronLink.tronWeb;
      }
    }
    return tronWeb;
  } else {
    //We are on the server or the user is not running metamask
    let tronweb = new TronWeb(fullNode, solidityNode, eventServer);
    tronweb.setAddress(process.env.NEXT_PUBLIC_TRONWEB_ADDRESS);
    return tronweb;
  }
};
export default getTronWeb;
