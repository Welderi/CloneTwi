import React, {useState, useEffect} from "react";

function UserProfile(){
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const getInfo = async () => {
            try{
                const response = await fetch("http://localhost:5000/api/user/getuserinfo", {
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
    }, [])

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
      </div>
    );
}

export default UserProfile;