const TronWeb = require("tronweb");

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

export const getPrivateTronWeb = () =>
  new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    process.env.TRONWEB_PRIVATE_KEY
  );

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

export const getConnectionStatus = () => {
  if (typeof window !== "undefined") {
    //We are in the browser
    let connectionStatus = {
      isTronLinkInstalled: false,
      isTronLinkUnlocked: false,
      network: "",
    };
    if (typeof window.tronLink !== "undefined") {
      connectionStatus.isTronLinkInstalled = true;
      if (window.tronLink.ready) {
        connectionStatus.isTronLinkUnlocked = true;
        let tronWeb = window.tronLink.tronWeb;
        if (tronWeb.fullNode.host.includes("shasta")) {
          connectionStatus.network = "shasta";
        }
      }
    }
    return connectionStatus;
  }
  return null;
};

export default getTronWeb;
