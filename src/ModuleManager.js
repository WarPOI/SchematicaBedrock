const fs = require("fs");
const path = require("path");

class ModuleManager {
  constructor() {
    this.modules = {};
    this.activate = {
      packageLog: false,
      schematica: false,
    };
  }

  loadModules(directory) {
    try {
      this.modules = {};
      const files = fs.readdirSync(directory);
      for (const file of files) {
        if (file.endsWith(".js")) {
          const moduleClass = require(path.join(directory, file));
          const moduleInstance = new moduleClass();
          this.modules[moduleInstance.name] = moduleInstance;
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке модулей:", error.message);
    }
  }

  handleCommand(command, context) {
    const name = command[0];
    const module = this.modules[name];

    if (module) {
      module.activate(context, command);
    } else {
      context.sendTextClient(context.player, `команда §l${name}§r не найдена`);
    }
  }
}

module.exports = ModuleManager;
