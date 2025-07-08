use CloneTwi;

CREATE TABLE [Message]
(
	MessageId INT PRIMARY KEY IDENTITY, 
	MessageText NVARCHAR(MAX),
	MessageIsEdited BIT DEFAULT 0,

	/* KEYS */

	Message_ParentId INT,
	Message_PreviousVersionId INT,
	Message_UserId NVARCHAR(450) NOT NULL,

	CONSTRAINT FK_Message_Parent FOREIGN KEY (Message_ParentId) REFERENCES [Message](MessageId),
	CONSTRAINT FK_Message_PreviousVersion FOREIGN KEY (Message_PreviousVersionId) REFERENCES [Message](MessageId),
	CONSTRAINT FK_Message_User FOREIGN KEY (Message_UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE [AudioMessage]
(
	AudioId INT PRIMARY KEY IDENTITY,
	AudioFile NVARCHAR(MAX) NOT NULL,

	/* KEYS */

	Audio_MessageId INT NOT NULL,

	CONSTRAINT FK_Audio_Message FOREIGN KEY (Audio_MessageId) REFERENCES [Message](MessageId) ON DELETE CASCADE
);

CREATE TABLE [EmojiMessage]
(
	EmojiId INT PRIMARY KEY IDENTITY,
	EmojiValue NVARCHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,

	/* KEYS */

	Emoji_MessageId INT NOT NULL,

	CONSTRAINT FK_Emoji_Message FOREIGN KEY (Emoji_MessageId) REFERENCES [Message](MessageId) ON DELETE CASCADE
);

CREATE TABLE [ThemeMessage]
(
	ThemeId INT PRIMARY KEY IDENTITY,
	ThemeType NVARCHAR(100) NOT NULL,

	/* KEYS */

	Theme_MessageId INT NOT NULL,

	CONSTRAINT FK_Theme_Message FOREIGN KEY (Theme_MessageId) REFERENCES [Message](MessageId) ON DELETE CASCADE
);

CREATE TABLE [Bookmark]
(
	BookmarkId INT PRIMARY KEY IDENTITY,

	/* KEYS */

	Bookmark_MessageId INT NOT NULL,
	Bookmark_UserId NVARCHAR(450) NOT NULL,

	UNIQUE (Bookmark_UserId, Bookmark_MessageId),

	CONSTRAINT FK_Bookmark_Message FOREIGN KEY (Bookmark_MessageId) REFERENCES [Message](MessageId),
	CONSTRAINT FK_Bookmark_User FOREIGN KEY (Bookmark_UserId) REFERENCES AspNetUsers(Id) 
);

CREATE TABLE [Repost]
(
	RepostId INT PRIMARY KEY IDENTITY,

	/* KEYS */

	Repost_MessageId INT NOT NULL,
	Repost_UserId NVARCHAR(450) NOT NULL,

	UNIQUE (Repost_UserId, Repost_MessageId),

	CONSTRAINT FK_Repost_Message FOREIGN KEY (Repost_MessageId) REFERENCES [Message](MessageId),
	CONSTRAINT FK_Repost_User FOREIGN KEY (Repost_UserId) REFERENCES AspNetUsers(Id)
);

CREATE TABLE [View]
(
	ViewId INT PRIMARY KEY IDENTITY,

	/* KEYS */

	View_MessageId INT NOT NULL,
	View_UserId NVARCHAR(450) NOT NULL,

	CONSTRAINT FK_View_Message FOREIGN KEY (View_MessageId) REFERENCES [Message](MessageId),
	CONSTRAINT FK_View_User FOREIGN KEY (View_UserId) REFERENCES AspNetUsers(Id)
);

CREATE TABLE [VideoMessage]
(
    VideoId INT PRIMARY KEY IDENTITY,
    VideoFile NVARCHAR(MAX) NOT NULL,
    VideoPreview NVARCHAR(MAX),        

    /* KEYS */

    Video_MessageId INT NOT NULL,

    CONSTRAINT FK_Video_Message FOREIGN KEY (Video_MessageId) REFERENCES [Message](MessageId) ON DELETE CASCADE
);

CREATE TABLE [FollowUser]
(
	FollowId INT PRIMARY KEY IDENTITY,

	/* KEYS */

	Follower_UserId NVARCHAR(450) NOT NULL,
	Following_UserId NVARCHAR(450) NOT NULL,

	CONSTRAINT FK_Follower_User FOREIGN KEY (Follower_UserId) REFERENCES AspNetUsers(Id),
	CONSTRAINT FK_Following_User FOREIGN KEY (Following_UserId) REFERENCES AspNetUsers(Id)
);


