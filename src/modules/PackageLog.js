class PackageLog {
  constructor() {
    this.name = ["pl", "packageLog"];
    this.description = "Logs the packets from server.";
  }

  activate(context) {
    context.gameData.packageLog = !context.gameData.packageLog;
    var packetLogEvent = ({ name, params }) => {
      var timeMinutesAndMilliseconds = this.getMinutesAndMilliseconds();
      context.sendTextClient(
        context.player,
        `§7${name}: ${timeMinutesAndMilliseconds.minutes}.${timeMinutesAndMilliseconds.milliseconds}`
      );
    };

    if (!context.packetLogEvent) {
      context.packetLogEvent = packetLogEvent.bind(this);
    }
    if (context.gameData.packageLog) {
      context.player.on("clientbound", context.packetLogEvent);
    } else {
      context.player.off("clientbound", context.packetLogEvent);
    }

    const colorToggle = context.gameData.packageLog ? "§a" : "§4";
    context.sendTextClient(
      context.player,
      `${colorToggle}packageLog: ${context.gameData.packageLog}`
    );
  }
  getMinutesAndMilliseconds() {
    const now = new Date();
    return {
      minutes: String(now.getMinutes()).padStart(2, "0"),
      milliseconds: String(now.getMilliseconds()).padStart(3, "0"),
    };
  }
}

module.exports = PackageLog;
