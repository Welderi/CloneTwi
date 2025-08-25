import React, {useState, useEffect} from "react";
import MessageCard from "../messageCard/messageCard";
import ControlMessages from "../messageController/controlMessages";
import {useParams} from "react-router-dom";

function UserProfile(){
    const [userInfo, setUserInfo] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const getInfo = async () => {
            try{
                const response = await fetch(`http://localhost:5000/api/user/getuserinfo/${userId || ""}`, {
                    method: "GET",
                    credentials: "include"
                });

                if(!response.ok){
                    const message = await response.text();
                    throw new Error(message || "Failed")
                }

                const data = await response.json();
                setUserInfo(data);

            }
            catch (err){
                console.error(err);
            }
        };

        getInfo();
    }, [userId])

    const { messages, emojis, reposts, bookmarks } = ControlMessages(userInfo?.id);

    return(
      <div>
          <h1>Profile</h1>
          {!userInfo ? (
              <p>Loading...</p>
          ) : (
              <>
                  <p><strong>Name:</strong> {userInfo.userName}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Bio:</strong> {userInfo.bio || "—"}</p>
                  <p><strong>Title:</strong> {userInfo.title || "—"}</p>
                  {userInfo.profileImageUrl && (
                      <img
                          src={`http://localhost:5000${userInfo.profileImageUrl}`}
                          alt="Profile"
                          style={{ width: "150px", borderRadius: "8px", marginTop: "10px" }}
                      />
                  )}
              </>
          )}
          <h2>Messages:</h2>
          {messages
              .filter(msg => msg.messageParentId === null)
              .map(msg => (
                  <MessageCard
                      key={msg.messageId}
                      message={msg}
                      emoji={emojis.filter(e => e.messageId === msg.messageId)}
                      allEmojis={emojis}
                      bookmarkBool={bookmarks.some(e => e.messageId === msg.messageId)}
                      repostBool={reposts.some(e => e.messageId === msg.messageId)}
                  />
              ))}
      </div>
    );
}

export default UserProfile;