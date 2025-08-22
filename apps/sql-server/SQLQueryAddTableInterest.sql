use CloneTwi;

CREATE TABLE Interest (
    InterestId INT IDENTITY(1,1) PRIMARY KEY,   
    InterestTopic NVARCHAR(255) NOT NULL,       
    InterestUserId NVARCHAR(450) NOT NULL,      
    CONSTRAINT FK_UserInterest_AspNetUsers FOREIGN KEY (InterestUserId)
        REFERENCES AspNetUsers(Id)
        ON DELETE CASCADE              
);

ALTER TABLE Message ADD IsStory BIT NOT NULL DEFAULT 0;