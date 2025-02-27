const fs = require("fs");
const path = require("path");

class ModuleManager {
  constructor() {
    this.modules = {};

    this.activate = {
      packageLog: false,
      schematica: false,
    };

    this.commandMap = new Map();
  }

  loadModules(directory) {
    try {
      this.modules = {};
      const files = fs.readdirSync(directory);
      for (const file of files) {
        if (file.endsWith(".js")) {
          const moduleClass = require(path.join(directory, file));
          const moduleInstance = new moduleClass();
          this.modules[moduleInstance.name[0]] = moduleInstance;
        }
      }
      for (const moduleName in this.modules) {
        const module = this.modules[moduleName];
        for (const cmd of module.name) {
          this.commandMap.set(cmd, module);
        }
      }
    } catch (error) {
      console.error("loadModules error", error.message);
    }
  }

  handleCommand(command, context) {
    const prefixCommand = command[0];
    const module = this.commandMap.get(prefixCommand);

    if (module) {
      module.activate(context, command);
    } else {
      context.sendTextClient(
        context.player,
        `command §l${prefixCommand}§r not found`
      );
    }
  }
}

module.exports = ModuleManager;
