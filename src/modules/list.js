const fs = require("fs");
const path = require("path");
class list {
  constructor() {
    this.name = "list";
    this.description = "Display a list of all files for .load";
  }

  activate(context) {
    var str = "All files \n";
    const files = fs.readdirSync(path.join(__dirname, "./../../schematica"));
    console.log(files);
    for (const fileName of files) {
      if (fileName !== ".gitkeep") str += `${fileName}\n`;
    }
    context.sendTextClient(context.player, str);
  }
}

module.exports = list;
