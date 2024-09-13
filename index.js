const net = require('net');

class RobotClient {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.client = new net.Socket();
    }

    connect() {
        this.client.connect(this.port, this.host, () => {
            console.log(`Mit dem Server verbunden: ${this.host}:${this.port}`);
        });

        this.client.on('data', (data) => {
            this.handleServerResponse(data.toString());
        });

        this.client.on('close', () => {
            console.log('Verbindung zum Server geschlossen');
        });

        this.client.on('error', (err) => {
            console.error('Fehler:', err.message);
        });
    }

    // Step-by-step method to send a connect message
    sendConnectMessage(ip) {
        const message = { ip_address: ip };
        this.sendMessageToServer(message);
    }

    // Step-by-step method to send a command
    sendCommand(apiId, params = null) {
        // Validate api_id is between 1000 and 2000
        if (apiId < 1000 || apiId > 2000) {
            console.error('Ungültige API-ID. Muss zwischen 1000 und 2000 liegen.');
            return;
        }

        let message = { api_id: apiId };

        // If params are given, ensure they follow the format {"x": <value>, "y": <value>, "z": <value>}
        if (params) {
            if (this.isValidParams(params)) {
                message.params = params;
            } else {
                console.error('Ungültige Parameter. Erwartetes Format: {"x": <value>, "y": <value>, "z": <value>}');
                return;
            }
        }

        this.sendMessageToServer(message);
    }

    isValidParams(params) {
        // Ensure params is an object with x, y, z as keys
        return params.hasOwnProperty('x') && params.hasOwnProperty('y') && params.hasOwnProperty('z');
    }

    sendMessageToServer(message) {
        const jsonMessage = JSON.stringify(message) + '\n';
        this.client.write(jsonMessage);
        console.log(`Nachricht gesendet: ${jsonMessage}`);
    }

    handleServerResponse(response) {
        console.log(`Antwort vom Server: ${response}`);
    }
}

// Example usage
const client = new RobotClient('127.0.0.1', 12346);
client.connect();

// Execute commands step by step
setTimeout(() => {
    client.sendConnectMessage('192.168.1.10');
}, 1000); // waits 1 second before sending



setTimeout(() => {
    // Command without parameters
    client.sendCommand(1004);
}, 3000); // waits 3 seconds before sending

setTimeout(() => {
    // Command without parameters
    client.sendCommand(1002);
}, 5000); // waits 3 seconds before sending

setTimeout(() => {
    // Command with parameters in the correct format
    client.sendCommand(1008, { x: 0.5, y: 0.0, z: 0.0 });
}, 8000); // waits 2 seconds before sending