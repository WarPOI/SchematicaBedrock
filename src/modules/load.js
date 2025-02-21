const path = require("path");
const fs = require("fs");
const { loadJsonFromFileSync } = require("./../datagenerator/gen");
const dataItem = loadJsonFromFileSync("./data/dataItem.json");
class Load {
  constructor() {
    this.name = "load";
    this.description = "<name files>, upload the schematic";
  }

  activate(context, command) {
    const nameFies = command[1];
    if (!fs.existsSync(`./schematica/${nameFies}`)) {
      context.sendTextClient(
        context.player,
        `file: §l§4${nameFies}§r, not found`
      );
    } else {
      context.nbtParser
        .processJSONData(`./schematica/${nameFies}`)
        .then((blockData) => {
          context.sendTextClient(context.player, `Loading...`);
          const startTime = new Date().getTime();
          const positionStart = context.authInputDataOld.position;
          const startX = Math.floor(positionStart.x);
          const startY = Math.floor(positionStart.y);
          const startZ = Math.floor(positionStart.z);
          for (let i = 0; i < blockData.length; i++) {
            const item = blockData[i];
            let block = dataItem[item.block];
            if (!block) {
              block = 1;
              console.log("block missing for item:", item.block);
            }
            const newPosition = {
              x: item.pos.x + startX,
              y: item.pos.y + startY,
              z: item.pos.z + startZ,
            };
            context.fakeEntityManager.fakeBlockEntity(newPosition, block);
          }
          const endTime = new Date().getTime();
          const timeElapsed = endTime - startTime;
          context.sendTextClient(
            context.player,
            `Loaded! Coordinates §2§lx:${startX} y:${startY} z:${startZ}§r§8(Time elapsed: ${timeElapsed} ms)`
          );
        })
        .catch((error) => {
          console.error("Error processing JSON data:", error);
          context.sendTextClient(context.player, `Error loading file: ${nameFies}`);
        });
    }
  }
}

module.exports = Load;
