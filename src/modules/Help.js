class Help {
  constructor() {
    this.name = "help";
    this.description = "выводить список всех доступных команд";
  }

  activate(context) {
    var str = "All Command \n"
    for (const module of Object.values(context.moduleManager.modules)) {
      str += `${module.name} - ${module.description}\n`
      // console.log(`${module.name} - ${module.description}`);
    }
    context.sendTextClient(context.player, str);
  }
}

module.exports = Help;