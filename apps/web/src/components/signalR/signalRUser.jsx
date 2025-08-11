import {HubConnectionBuilder, HttpTransportType} from "@microsoft/signalr";

const SignalRUser = () => {
    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/user", {
            withCredentials: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    async function start() {
        try {
            await connection.start();
        } catch (err) {
            console.error("SignalR Connection Error:", err);
            setTimeout(start, 5000);
        }
    }

    connection.onclose(async () => {
        await start();
    });

    start();

    return connection;
};

export default SignalRUser;
