class Help {
  constructor() {
    this.name = ["h","help"];
    this.description = "Display a list of all available commands";
  }

  activate(context) {
    var str = "§8All Command§r§l \n";
    for (const module of Object.values(context.moduleManager.modules)) {
      str += `${module.name.join(" ")} - ${module.description}\n`;
    }
    str += "Total Commands: " + Object.keys(context.moduleManager.modules).length + "\n";
    context.sendTextClient(context.player, str);
  }
}

module.exports = Help;
