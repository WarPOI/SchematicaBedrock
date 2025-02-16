const path = require("path");
const fs = require("fs");
const { loadJsonFromFileSync } = require("./../datagenerator/gen");
const dataBlockJava = loadJsonFromFileSync("./data/dataBlockJava.json");
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
        .then((mapArpData) => {
          context.sendTextClient(context.player, `Loading...`);
          const startTime = new Date().getTime();
          const positionStart = context.authInputDataOld;
          mapArpData.forEach((item) => {
            const block = dataBlockJava[item.block];
            const newPosition = {
              x: item.pos.x + Math.floor(positionStart.position.x),
              y: item.pos.y + Math.floor(positionStart.position.y),
              z: item.pos.z + Math.floor(positionStart.position.z),
            };
            context.fakeEntityManager.fakeBlockEntity(newPosition, block);
          });
          const endTime = new Date().getTime();
          const timeElapsed = endTime - startTime;
          context.sendTextClient(
            context.player,
            `Loaded! Coordinates §2§lx:${Math.floor(
              positionStart.position.x
            )} y:${Math.floor(positionStart.position.y)} z:${Math.floor(
              positionStart.position.z
            )}§r§8(Time elapsed: ${timeElapsed} ms)`
          );
        })
        .catch(console.log);
    }
  }
}

module.exports = Load;
