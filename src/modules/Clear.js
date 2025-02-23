class Clear {
  constructor() {
    this.name = "c";
    this.description = "Clear schematica";
  }

  activate(context) {
    const lengthFake = context.fakeEntityManager.clearData()
    context.sendTextClient(
      context.player,
      `Clear §4${
        Object.keys(lengthFake).length
      }§r block`
    );
  }
}

module.exports = Clear;
