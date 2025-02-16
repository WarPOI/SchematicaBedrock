class Help {
  constructor() {
    this.name = "help";
    this.description = "Display a list of all available commands";
  }

  activate(context) {
    var str = "§8All Command§r§l \n";
    for (const module of Object.values(context.moduleManager.modules)) {
      str += `${module.name} - ${module.description}\n`;
    }
    context.sendTextClient(context.player, str);
  }
}

module.exports = Help;
