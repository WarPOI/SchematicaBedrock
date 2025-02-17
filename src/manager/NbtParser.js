const fs = require("fs");
const path = require("path");
const Vec3 = require("vec3");

const nbt = require("prismarine-nbt");
const { Schematic } = require("prismarine-schematic");

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
    let jsonData;
    const fileExtName = path.extname(filePath);
    var transformedBlocks;
    switch (fileExtName) {
      case ".nbt":
        jsonData = await this.decodeNBT(filePath);
        const paletteMapping = this.createPaletteMapping(
          jsonData.value.palette.value.value
        );
        transformedBlocks = this.transformBlocks(
          jsonData.value.blocks.value.value,
          paletteMapping
        );
        return transformedBlocks;
      case ".mcstructure":
        jsonData = await this.decodeNBT(filePath);
        transformedBlocks = this.convertMcStructure(jsonData);
        return transformedBlocks;
      case ".schematic":
        const buffer = fs.readFileSync(filePath);
        const schematic = await Schematic.read(buffer);
        console.log(schematic);
        transformedBlocks = this.extractBlocksSchematic(schematic);
        return transformedBlocks;
      default:
        console.error(`File type ${fileExtName} cannot be processed`);
        break;
    }
  }
  convertMcStructure(data) {
    data = nbt.simplify(data);
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
  extractBlocksSchematic(schematic) {
    const blocks = [];
    for (let y = 0; y < schematic.size.y; y++) {
      for (let z = 0; z < schematic.size.z; z++) {
        for (let x = 0; x < schematic.size.x; x++) {
          const pos = new Vec3(x, y, z);
          const block = schematic.getBlock(pos);
          console.log(block.name, pos)
          if (block.name !== "air") {
            blocks.push({
              pos: { x, y, z },
              block: block.name,
            });
          }
        }
      }
    }
    return blocks;
  }
}

module.exports = NbtParser;
