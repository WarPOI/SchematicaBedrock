const { loadJsonFromFileSync } = require("../datagenerator/gen");
const dataItem = loadJsonFromFileSync("./data/dataItem.json");
class Render {
  constructor() {
    this.name = ["r", "render"];
    this.description = "<namber> - Render radius";
    this.testInterval = null;
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

module.exports = Render;
