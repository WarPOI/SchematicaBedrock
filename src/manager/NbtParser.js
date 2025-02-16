const fs = require("fs");
const path = require("path");

const nbt = require("prismarine-nbt");

class NbtParser {
  constructor() {}

  decodeNBT(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject("Error reading file:", err);
          return;
        }
        nbt.parse(data, (err, nbtData) => {
          if (err) {
            reject("Error parsing Nbt:", err);
            return;
          }
          resolve(nbtData);
        });
      });
    });
  }

  createPaletteMapping(paletteArray) {
    const mapping = {};
    paletteArray.forEach((item, index) => {
      const blockName = item.Name.value;
      mapping[index] = blockName.slice(10);
    });
    return mapping;
  }

  transformBlocks(blocksArray, paletteMapping) {
    return blocksArray.map((block) => {
      const pos = {
        x: block.pos.value.value[0],
        y: block.pos.value.value[1],
        z: block.pos.value.value[2],
      };
      const stateIndex = block.state.value;
      const blockName = paletteMapping[stateIndex];
      return { pos, block: blockName };
    });
  }

  async processJSONData(filePath) {
    const jsonData = await this.decodeNBT(filePath);
    const fileExtName = path.extname(filePath);
    var transformedBlocks
    switch (fileExtName) {
      case ".nbt":
        const paletteMapping = this.createPaletteMapping(
          jsonData.value.palette.value.value
        );
        transformedBlocks = this.transformBlocks(
          jsonData.value.blocks.value.value,
          paletteMapping
        );
        return transformedBlocks;
      case ".mcstructure":
        
      transformedBlocks = this.convertMcStructure(jsonData);
      return transformedBlocks

      default:
        console.error(`тип ${fileExtName} не можеть быть обработан`);
        break;
    }
  }
  convertMcStructure(setData) {
    data = nbt.simplify(setData);
    const blocks = data.structure.block_indices[0];
    const palette = data.structure.palette.default.block_palette;
    const result = [];
    for (let x = 0; x < data.size[0]; x++) {
      for (let y = 0; y < data.size[1]; y++) {
        for (let z = 0; z < data.size[2]; z++) {
          const index = blocks[x + data.size[0] * (y + data.size[1] * z)];
          const blockName = palette[index].name;
          if (blockName !== "minecraft:air") {
            result.push({
              pos: { x, y, z },
              block: blockName.slice(10),
            });
          }
        }
      }
    }
    return result;
  }
}

module.exports = NbtParser;
