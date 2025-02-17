const fs = require("fs");
const path = require("path");
class list {
  constructor() {
    this.name = "list";
    this.description = "Display a list of all files for .load";
  }

  activate(context) {
    const files = fs.readdirSync(path.join(__dirname, "./../../schematica"));
    var str = "All files \n";
    for (const fileName of files) {
      if (fileName !== ".gitkeep") str += `${fileName}\n`;
    }
    context.sendTextClient(context.player, str);
  }
}

module.exports = list;
