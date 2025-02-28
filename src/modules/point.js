class Point {
  constructor() {
    this.name = ["p", "point"];
    this.description = "select a block.";
  }

  activate(context) {
    context.gameData.point = !context.gameData.point;
    var blockSelector = (params, des) => {
      const { action_type, block_position, block_runtime_id } =
        params.transaction.transaction_data;
      // console.log(params);
      if (
        params.transaction.transaction_type == "item_use" &&
        action_type == "click_block"
      ) {
        des.canceled = true;

        // console.log(params.transaction);
        if (JSON.stringify(this.posBlock) !== JSON.stringify(block_position)) {
          context.sendTextClient(
            context.player,
            `§aPoint selected x:${block_position.x} y:${block_position.y} z:${block_position.z}`
          );
          if (this.posBlock) {
            context.fakeBlockManager.updateBlock(
              this.posBlock,
              this.blockRuntimeId
            );
          }
          this.posBlock = block_position;
          this.blockRuntimeId = block_runtime_id;
          context.fakeBlockManager.blockEntityData(this.posBlock);
          context.fakeBlockManager.updateBlock(this.posBlock);
        }
      }
    };

    if (!context.blockSelector) {
      context.blockSelector = blockSelector.bind(this);
    }
    if (context.gameData.point) {
      context.on("serverbound-inventory_transaction", context.blockSelector);
    } else {
      context.off("serverbound-inventory_transaction", context.blockSelector);
    }

    const colorToggle = context.gameData.point ? "§a" : "§4";
    context.sendTextClient(
      context.player,
      `${colorToggle}Point: ${context.gameData.point}`
    );
  }
}

module.exports = Point;
