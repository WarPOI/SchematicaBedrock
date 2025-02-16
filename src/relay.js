const { Relay } = require("bedrock-protocol");
const path = require("path");

const { loadJsonFromFileSync } = require("./datagenerator/gen");
const FakeEntityManager = require("./manager/FakeEntity");
const ModuleManager = require("./ModuleManager");
const NbtParser = require("./manager/NbtParser");

class MinecraftRelay {
  constructor(relayOptions) {
    this.relayOptions = relayOptions;
    this.gameData = {
      prefixChat: "§5[Schematica]§r",
      prefixCommand: ".",
      selected_item: { network_id: 0 },
      selected_slot: 0,
    };
  }

  connect() {
    try {
      this.relay = new Relay(this.relayOptions);
      this.moduleManager = new ModuleManager();
      this.nbtParser = new NbtParser();
      this.moduleManager.loadModules(path.join(__dirname, "./modules"));
      this.relay.listen();
      console.log("Relay start!");
      this.relay.on("connect", (player) => {
        this.player = player;
        this.fakeEntityManager = new FakeEntityManager(this.player);
        this.handlePlayerConnection(this.player);
      });
    } catch (err) {
      console.error("Ошибка при подключении:", err);
    }
  }

  handlePlayerConnection(player) {
    console.log("New connection", player.connection.address);
    player.on("clientbound", ({ name, params }, des) => {
      this.handleClientboundMessage(player, name, params, des);
    });

    player.on("serverbound", ({ name, params }, des) => {
      this.handleServerboundMessage(player, name, params, des);
    });
  }

  handleClientboundMessage(player, name, params, des) {
    switch (name) {
      case "start_game":
        this.handleStartGame(player, params);
        break;
      case "game_rules_changed":
        this.handleGameRulesChanged(params);
        break;
      case "mob_equipment":
        this.handleMobEquipmentClient(params);
        break;
    }
  }

  handleServerboundMessage(player, name, params, des) {
    switch (name) {
      case "player_auth_input":
        this.handlePlayerAuthInput(params);
        break;
      case "text":
        this.handleTextClient(params, des);
        break;
      case "mob_equipment":
        this.handleMobEquipmentServer(params);
        break;
    }
  }

  handleStartGame(player, params) {
    this.startGameDate = params;
    this.playerGamemode = this.startGameDate.player_gamemode;

    this.updateGameRules(player, "showCoordinates", true, "bool");
  }

  handleGameRulesChanged(params) {
    params.rules = params.rules.map((rule) => {
      if (rule.name === "showCoordinates") {
        return { ...rule, value: true };
      }
      return rule;
    });
  }

  handleTextClient(params, des) {
    const { message } = params;
    if (message.startsWith(this.gameData.prefixCommand)) {
      des.canceled = true;
      var command = message
        .slice(this.gameData.prefixCommand.length)
        .trim()
        .split(/\p{Zs}/u)
        .filter(Boolean);
      console.log("команда", command);
      this.moduleManager.handleCommand(command, this);
    }
  }

  handlePlayerAuthInput(params) {
    this.authInputDataOld = params;
  }

  handleMobEquipmentClient(params) {
    if (
      params.runtime_entity_id == this.startGameDate.runtime_entity_id &&
      params.selected_slot == params.slot
    )
      this.gameData.selected_item = params.item;
    this.gameData.selected_slot = params.selected_slot;
  }
  handleMobEquipmentServer(params) {
    if (params.selected_slot == params.slot) {
      this.gameData.selected_item = params.item;
      this.gameData.selected_slot = params.selected_slot;
    }
  }

  updateGameRules(player, name, value, type) {
    player.queue("game_rules_changed", {
      rules: [
        {
          name,
          editable: true,
          type,
          value,
        },
      ],
    });
  }

  sendTextClient(player, message) {
    player.queue("text", {
      type: "json_whisper",
      needs_translation: false,
      message: `{"rawtext":[{"text":"${this.gameData.prefixChat} ${message}"}]}`,
      xuid: "",
      platform_chat_id: "",
      filtered_message: "",
    });
  }
  spawnParticle(player, position, particle_name) {
    player.queue("spawn_particle_effect", {
      dimension: 0,
      entity_id: -1,
      position,
      particle_name,
      molang_variables: undefined,
    });
  }
}

module.exports = MinecraftRelay;
