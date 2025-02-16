const { loadJsonFromFileSync } = require("../datagenerator/gen");
const dataBlockJava = loadJsonFromFileSync("./data/dataBlockJava.json");
class Schematica {
  constructor() {
    this.name = "shem";
    this.description = "";
  }

  activate(context, command) {
    //context.fakeEntityManager.fakeBlockEntity(context.authInputDataOld.position);
    console.log("command", command);
    switch (command[1]) {
      case "test":
        context.nbtParser
          .processJSONData("./name")
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
          })
          .catch(console.log);

        break;
      default:
        if (this.testInterval) {
          clearInterval(this.testInterval);
          context.sendTextClient(
            context.player,
            `§4render off`
          );
        } else {
          this.testInterval = setInterval(() => {
            context.fakeEntityManager.renderEntitiesWithinRadius(
              context.authInputDataOld.position,
              7
            );
          }, 200);
          context.sendTextClient(
            context.player,
            `§2render on`
          );
        }

        break;
    }
  }
}

module.exports = Schematica;
