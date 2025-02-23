const fs = require("fs").promises;
const path = require("path");
const Vec3 = require("vec3");
const nbt = require("prismarine-nbt");
const { Schematic } = require("prismarine-schematic");

class NbtParser {
  constructor() {
    this.simplifyNbt = nbt.simplify;
    this.parseNbt = nbt.parse;
    this.blockData = [];
  }

  async decodeNBT(filePath) {
    try {
      const data = await fs.readFile(filePath);
      return new Promise((resolve, reject) => {
        this.parseNbt(data, (err, nbtData) => {
          if (err) {
            reject(new Error(`NBT parsing failed: ${err.message}`));
          } else if (!nbtData) {
            reject(new Error("NBT parsing returned no data"));
          } else {
            resolve(nbtData);
          }
        });
      });
    } catch (err) {
      throw new Error(`File reading failed: ${err.message}`);
    }
  }

  createPaletteMapping(paletteArray) {
    const mapping = Object.create(null);
    for (let i = 0, len = paletteArray.length; i < len; i++) {
      mapping[i] = paletteArray[i].Name.value.slice(10);
    }
    return mapping;
  }

  transformBlocks(blocksArray, paletteMapping) {
    const result = new Array(blocksArray.length);
    for (let i = 0, len = blocksArray.length; i < len; i++) {
      const block = blocksArray[i];
      const posVal = block.pos.value.value;
      result[i] = {
        pos: { x: posVal[0], y: posVal[1], z: posVal[2] },
        block: paletteMapping[block.state.value],
      };
    }
    return result;
  }

  async processJSONData(filePath) {
    const fileExtName = path.extname(filePath).toLowerCase();
    const jsonData = await this.decodeNBT(filePath);

    switch (fileExtName) {
      case ".nbt": {
        const paletteMapping = this.createPaletteMapping(
          jsonData.value.palette.value.value
        );
        return this.transformBlocks(
          jsonData.value.blocks.value.value,
          paletteMapping
        );
      }
      case ".mcstructure": {
        return this.convertMcStructure(jsonData);
      }
      case ".schematic": {
        const buffer = await fs.readFile(filePath);
        const schematic = await Schematic.read(buffer);
        return this.extractBlocksSchematic(schematic);
      }
      default:
        throw new Error(`Unsupported file type: ${fileExtName}`);
    }
  }

  convertMcStructure(data) {
    const simplified = this.simplifyNbt(data);
    const blocks = simplified.structure.block_indices[0];
    const palette = simplified.structure.palette.default.block_palette;
    const size = simplified.size;
    const result = [];
    let resultIndex = 0;

    const xMax = size[0];
    const yMax = size[1];
    const xyMax = xMax * yMax;

    for (let i = 0, len = blocks.length; i < len; i++) {
      const index = blocks[i];
      if (palette[index].name !== "minecraft:air") {
        const x = i % xMax;
        const y = Math.floor(i / xMax) % yMax;
        const z = Math.floor(i / xyMax);
        result[resultIndex++] = {
          pos: { x, y, z },
          block: palette[index].name.slice(10),
        };
      }
    }

    result.length = resultIndex;
    return result;
  }

  extractBlocksSchematic(schematic) {
    const size = schematic.size;
    const result = [];
    let resultIndex = 0;

    const xMax = size.x;
    const yMax = size.y;
    const zMax = size.z;

    for (let y = 0; y < yMax; y++) {
      for (let z = 0; z < zMax; z++) {
        for (let x = 0; x < xMax; x++) {
          const block = schematic.getBlock(new Vec3(x, y, z));
          if (block.name !== "air") {
            result[resultIndex++] = {
              pos: { x, y, z },
              block: block.name,
            };
          }
        }
      }
    }

    result.length = resultIndex;
    return result;
  }
}

module.exports = NbtParser;
