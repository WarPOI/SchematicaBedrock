const fs = require('fs');
const path = require('path');

const Relay = require("./src/relay.js")
const configPath = path.join(__dirname, 'config.json');

const defaultConfig = {
    "version": "1.21.60",
    "host": "0.0.0.0",
    "port": 19132,
    "offline": false,
    "destination": {
        "host": "IP",
        "port": 19132
    }
};

function checkConfigFile() {
    if (!fs.existsSync(configPath)) {
        // Создание файла с дефолтным конфигом
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log('Конфигурационный файл создан. Пожалуйста, заполните config.json и перезапустите программу.');
        process.exit(0);
    } else {
        // Чтение данных из конфигурационного файла
        const configFile = fs.readFileSync(configPath, 'utf-8');
        const configData = JSON.parse(configFile);
        return configData;
    }
}

const relayConfig = checkConfigFile()

const relay = new Relay(relayConfig)
relay.connect()

function shutdown() {
  relay.player?.disconnect("опа, опа, опа, опа,опа, опа, опа");
}
process.on("SIGINT", (s) => {
  shutdown();
  process.exit(0);
});
process.on("beforeExit", (s) => {
  shutdown();
  process.exit(0);
});