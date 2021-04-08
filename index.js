const { setInterval,setTimeout } = require( "timers");

const { S7Endpoint, S7ItemGroup } = require("@st-one-io/nodes7");

let plc = new S7Endpoint({ host: "10.0.116.52"});

plc.on("error", (e) => console.log("PLC Error!", e));
plc.on("disconnect", () => console.log("PLC Disconnect"));
plc.once("connect", async () => {
  console.log("connected!");

  // check the documentation for all available functions
  await plc.getTime(); //gets the PLC's current date/time
  await plc.blockCount(); //gets a count of blocks from the PLC of each type

  // you can use the S7ItemGroup to perform optimized read/write of variables

  let itemGroup = new S7ItemGroup(plc);
  for (let index = 0; index < 10; index++) {
    await delay(3000)

    let vars = {
      W16: "DB260,W16", // word real at DB260,W16
      "X6.1": "DB260,X6.1", // Bit at DB260,X6.1
      "X6.7": "DB260,X6.7", // Bit at DB260,X6.7
      "X7.0": "DB260,X7.0", // Bit at DB260,X7.0
      "X7.1": "DB260,X7.1", // Bit at DB260,X7.1
    };
    itemGroup.setTranslationCB((tag) => vars[tag]); //translates a tag name to its address
    itemGroup.addItems(Object.keys(vars));
  
    console.log(await itemGroup.readAllItems());
  }
  await plc.disconnect();

});

const delay = ms => new Promise(res=>setTimeout(res,ms))
