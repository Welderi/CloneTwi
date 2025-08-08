import {HubConnectionBuilder, HttpTransportType} from "@microsoft/signalr";

const SignalRPost = (onNewPost) => {
    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/post", {
            withCredentials: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    connection.on("messages", (data) => {
        onNewPost(data);
    });

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

export default SignalRPost;
