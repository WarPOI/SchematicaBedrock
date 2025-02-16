# SchematicaBedrock

## Project Description
SchematicaBedrock is a project designed for working with schematics in the Bedrock edition of Minecraft. It leverages the `bedrock-protocol`, `prismarine-nbt`, and `prismarine-schematic` libraries.

## Installation
1. Ensure you have [Node.js](https://nodejs.org/en/download) installed.
2. Clone the repository:
   ```sh
   git clone https://github.com/WarPOI/SchematicaBedrock.git
   ```
3. Navigate to the project directory:
   ```sh
   cd SchematicaBedrock
   ```
4. Install the dependencies:
   ```sh
   npm install
   ```

### To work on Android, you need to install Termux

## Usage

### Step-by-Step Guide

1. **Prepare the Files**
   - Place your `.nbt` and `.mcstructure` files into the `schematica` folder within the project directory.

2. **Set Render Radius**
   - In the game, use the command:
     ```sh
     .shem <number>
     ```
   - Replace `<number>` with the desired render radius.

3. **Load the Schematic**
   - To upload the schematic, use the command:
     ```sh
     .load <filename>
     ```
   - Replace `<filename>` with the name of the file you want to load (without the file extension).

### Example

1. In the game, set the render radius to 10:
   ```sh
   .shem 10
   ```
2. Load the `example.nbt` file:
   ```sh
   .load example.nbt
   ```


## License
This project is licensed under the ISC License.