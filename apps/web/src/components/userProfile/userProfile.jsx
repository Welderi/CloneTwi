import React, {useState, useEffect} from "react";
import MessageCard from "../messageCard/messageCard";
import ControlMessages from "../messageController/controlMessages";
import useFollowController from "../userCard/followController";
import { useLocation } from "react-router-dom";
import st from './userProfile.module.css';
import {person, profileBack} from '../../images';
import Story from "../story/story";

function UserProfile(){
    const [userInfo, setUserInfo] = useState(null);
    const [userStories, setUserStories] = useState([]);
    const [viewMode, setViewMode] = useState("feeds");
    const location = useLocation();
    const user = location.state || null;
    const { follow, unfollow, count, isFollowed, followingCount  } = useFollowController(user);

    const handleFollowClick = () => {
        if(isFollowed) {
            unfollow();
        }
        else {
            follow();
        };
    };

    useEffect(() => {
        const getInfo = async () => {
            try{
                const response = await fetch(`http://localhost:5000/api/user/getuserinfo/${user?.id || ""}`, {
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
    }, [user?.id])

    useEffect(() => {
        const getStories = async () => {
            try{
                const response = await fetch(`http://localhost:5000/api/message/getuserstories/${user?.id || ""}`, {
                    method: "GET",
                    credentials: "include"
                });

                if(!response.ok){
                    const message = await response.text();
                    throw new Error(message || "Failed")
                }

                const data = await response.json();
                setUserStories(data);

            }
            catch (err){
                console.error(err);
            }
        };

        getStories();
    }, [user?.id])

    const { messages, emojis, reposts, bookmarks } = ControlMessages(userInfo?.id);

    return(
      <div style={{overflow: 'hidden'}}>
          {!userInfo ? (
              <p>Loading...</p>
          ) : (
              <>
                  <div>
                      <img
                          src={!userInfo.background
                              ? profileBack : `http://localhost:5000${userInfo.background}`}
                          alt="Profile"
                          className={st.back}
                      />
                      <div className={st.profile}>
                          <img
                              src={!userInfo.profileImageUrl
                                  ? person : `http://localhost:5000${userInfo.profileImageUrl}`}
                              alt="Profile"
                              className={st.profileImg}
                          />
                          <div className={st.profileInfo}>
                              <p style={{fontSize: "36px"}}>{userInfo.userName}</p>
                              <p style={{fontSize: "16px", fontStyle: "italic"}}>
                                  <strong style={{visibility: userInfo.bio ? "visible" : "hidden"}}>&nbsp;&nbsp;&nbsp;&nbsp;"</strong>
                                    {userInfo.bio || ""}
                                  <strong style={{visibility: userInfo.bio ? "visible" : "hidden"}}>"</strong>
                              </p>
                              <p>Моїх робіт: {messages
                                        .filter(msg => msg.messageParentId === null && msg.isStory === false).length}
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  Читачі: {count}
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  Читаю: {followingCount}
                              </p>
                          </div>
                          {user ? (
                              <button
                                  onClick={handleFollowClick}
                                  className={`${st.profileBtn} ${isFollowed ? st.profileBtnBackFollow : st.profileBtnBackUnFollow}`}>
                                  Читаю
                              </button>
                          ) : null}
                      </div>

                  </div>
              </>
          )}

          <div className={`${st.centerBox}`}>
              <div className={st.buttons}>
                  <p onClick={() => setViewMode("feeds")}>Фіди</p>
                  <p onClick={() => setViewMode("snips")}>Сніпи</p>
              </div>
              <div className={st.underline}>
                  <div
                      className={st.activeIndicator}
                      style={{
                          width: "75px",
                          transform: `translateX(${viewMode === "feeds" ? "-15px" : "calc(100% - 15px)"})`,
                      }}
                  />
              </div>
          </div>

          <div className={`${st.centerBox}`}>
              {viewMode === "feeds" && messages
                  .filter(msg => msg.messageParentId === null && msg.isStory === false)
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
              {viewMode === "snips" &&
                  <Story stories={userStories} />
              }
          </div>
      </div>
    );
}

export default UserProfile;