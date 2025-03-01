const path = require("path");
const fs = require("fs");
const { loadJsonFromFileSync } = require("./../datagenerator/gen");
const dataItem = loadJsonFromFileSync("./data/dataItem.json");
class Load {
  constructor() {
    this.name = ["l", "load"];
    this.description = "<name files> <na, upload the schematic";
  }

  activate(context, command) {
    const nameFies = command[1];

    const toLoad = `./schematica/${nameFies}`;
    if (!fs.existsSync(toLoad)) {
      context.sendTextClient(
        context.player,
        `file: §l§4${nameFies}§r, not found`
      );
    } else {
      const positionStart = context.moduleManager.modules.p.posBlock
        ? context.moduleManager.modules.p.posBlock
        : context.authInputDataOld.position;

      context.fakeEntityManager.clearData();
      this.load(context, nameFies, toLoad, positionStart);
    }
  }
  load(context, nameFies, toLoad, positionStart) {
    context.nbtParser
      .processJSONData(toLoad)
      .then((blockData) => {
        context.sendTextClient(context.player, `Loading...`);
        const startTime = new Date().getTime();
        context.nbtParser.blockData = blockData;
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
        context.sendTextClient(
          context.player,
          `Error loading file: ${nameFies}`
        );
      });
  }
}

module.exports = Load;
