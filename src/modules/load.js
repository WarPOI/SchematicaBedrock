const path = require("path");
const fs = require("fs")
const { loadJsonFromFileSync } = require("./../datagenerator/gen");
const dataBlockJava = loadJsonFromFileSync("./data/dataBlockJava.json");
class Load {
  constructor() {
    this.name = "load";
    this.description = "<name files>, загружает схематику";
  }

  activate(context, command) {
    const nameFies = command[1];
    if (!fs.existsSync(`./schematica/${nameFies}`)) {
      context.sendTextClient(context.player, `фаил: §l§4${nameFies}§r, не найдень `)
    } else {
      context.nbtParser
        .processJSONData(`./schematica/${nameFies}`)
        .then((mapArpData) => {
          console.log(mapArpData);
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
          context.sendTextClient(context.player, `Загруженно! кординаты §2§lx:${Math.floor(positionStart.position.x)} y:${Math.floor(positionStart.position.y)} z:${Math.floor(positionStart.position.z)}`);
        })
        .catch(console.log);
    }
  }
}

module.exports = Load;
