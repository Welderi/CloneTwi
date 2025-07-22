import {HubConnectionBuilder, HttpTransportType} from "@microsoft/signalr";

const SignalR = (onNewPost) => {
    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/post", {
            withCredentials: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    connection.on("messages", (data) => {
        console.log("Received new post:", data);
        onNewPost(data);
    });

    async function start() {
        try {
            await connection.start();
            console.log("SignalR Connected.");
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

export default SignalR;
