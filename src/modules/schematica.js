const { loadJsonFromFileSync } = require("../datagenerator/gen");
const dataItem = loadJsonFromFileSync("./data/dataItem.json");
class Schematica {
  constructor() {
    this.name = "shem";
    this.description = "<namber> - Render radius";
  }

  activate(context, command) {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
      context.sendTextClient(context.player, `§4render off`);
    } else {
      this.testInterval = setInterval(() => {
        context.fakeEntityManager.renderEntitiesWithinRadius(
          context.authInputDataOld.position,
          Number(command[1]) ? Number(command[1]) : 7
        );
      }, 200);
      context.sendTextClient(context.player, `§2render on`);
    }
  }
}

module.exports = Schematica;
