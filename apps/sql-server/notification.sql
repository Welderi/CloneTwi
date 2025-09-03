use CloneTwi;

/*Reposts, Follows, Emojis*/ 

CREATE TABLE Notification (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    NotificationUserId NVARCHAR(450) NOT NULL,   
    Type NVARCHAR(50) NOT NULL,                   
    RepostId INT NULL,
    FollowId INT NULL,
    EmojiId INT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Notification_Repost FOREIGN KEY (RepostId) REFERENCES Repost(RepostId),
    CONSTRAINT FK_Notification_Follow FOREIGN KEY (FollowId) REFERENCES FollowUser(FollowId),
    CONSTRAINT FK_Notification_Emoji FOREIGN KEY (EmojiId) REFERENCES EmojiMessage(EmojiId)
);
