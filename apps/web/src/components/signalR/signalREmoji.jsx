import {HubConnectionBuilder, HttpTransportType} from "@microsoft/signalr";

const SignalREmoji = (newEmoji) => {
    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/emoji", {
            withCredentials: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    connection.on("emojis", (data) => {
        console.log("Recieved: ", data);
        newEmoji(data);
    });

    async function start(){
        try{
            await connection.start();
            console.log("SignalR Emoji connected.");
        }
        catch (err){
            console.log("SignalR error: ", err);
            setTimeout(start, 5000);
        }
    }

    connection.onclose(async () => {
        await start();
    });

    start();

    return connection;
};

export default SignalREmoji;