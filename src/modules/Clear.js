class Clear {
  constructor() {
    this.name = "c";
    this.description = "Clear schematica";
  }

  activate(context) {
    context.fakeEntityManager.renderedEntities.forEach((runtime_id) => {
      context.fakeEntityManager.removeEntity(runtime_id);
    });
    context.sendTextClient(
      context.player,
      `Clear §4${
        Object.keys(context.fakeEntityManager.fakeEntities).length
      }§r block`
    );
    context.fakeEntityManager.fakeEntities = {};
  }
}

module.exports = Clear;
