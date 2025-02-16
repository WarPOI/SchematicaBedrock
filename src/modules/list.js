const fs = require("fs");
const path = require('path');
class list {
  constructor() {
    this.name = "list";
    this.description = "выводить список всех файлов для .load";
  }

  activate(context) {
    var str = "Все файлы \n";
    const files = fs.readdirSync(path.join(__dirname, "./../../schematica"));
    console.log(files)
    for (const fileName of files) {
      str += `${fileName}\n`;
      // console.log(`${module.name} - ${module.description}`);
    }
    context.sendTextClient(context.player, str);
  }
}

module.exports = list;
