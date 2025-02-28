class FakeBlockManager {
  constructor(player) {
    this.player = player;
  }

  updateBlock(position, block_runtime_id = 388079635) {
    this.player.queue("update_block", {
      position,
      block_runtime_id,
      flags: {
        _value: 3,
        neighbors: true,
        network: true,
        no_graphic: false,
        unused: false,
        priority: false,
      },
      layer: 0,
    });
  }
  blockEntityData(position) {
    this.player.queue("block_entity_data", {
      position,
      nbt: {
        type: "compound",
        name: "",
        value: {
          animationMode: {
            type: "byte",
            value: 0,
          },
          animationSeconds: {
            type: "float",
            value: 0,
          },
          data: {
            type: "int",
            value: 1,
          },
          dataField: {
            type: "string",
            value: "",
          },
          id: {
            type: "string",
            value: "StructureBlock",
          },
          ignoreEntities: {
            type: "byte",
            value: 0,
          },
          includePlayers: {
            type: "byte",
            value: 0,
          },
          integrity: {
            type: "float",
            value: 100,
          },
          isMovable: {
            type: "byte",
            value: 1,
          },
          isPowered: {
            type: "byte",
            value: 0,
          },
          lastTouchedPlayerId: {
            type: "long",
            value: -1,
          },
          mirror: {
            type: "byte",
            value: 0,
          },
          redstoneSaveMode: {
            type: "int",
            value: 0,
          },
          removeBlocks: {
            type: "byte",
            value: 0,
          },
          rotation: {
            type: "byte",
            value: 0,
          },
          seed: {
            type: "long",
            value: 0,
          },
          showBoundingBox: {
            type: "byte",
            value: 1,
          },
          structureName: {
            type: "string",
            value: "",
          },
          x: {
            type: "int",
            value: position.x,
          },
          xStructureOffset: {
            type: "int",
            value: 0,
          },
          xStructureSize: {
            type: "int",
            value: 5,
          },
          y: {
            type: "int",
            value: position.y,
          },
          yStructureOffset: {
            type: "int",
            value: -1,
          },
          yStructureSize: {
            type: "int",
            value: 5,
          },
          z: {
            type: "int",
            value: position.z,
          },
          zStructureOffset: {
            type: "int",
            value: 0,
          },
          zStructureSize: {
            type: "int",
            value: 5,
          },
        },
      },
    });
  }
}

module.exports = FakeBlockManager;
