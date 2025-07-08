USE master;
IF DB_ID('CloneTwi') IS NULL
BEGIN
    RESTORE DATABASE CloneTwi
    FROM DISK = '/var/backup/CloneTwi.bak'
    WITH 
        MOVE 'CloneTwi' TO '/var/opt/mssql/data/CloneTwi.mdf',
        MOVE 'CloneTwi_log' TO '/var/opt/mssql/data/CloneTwi_log.ldf',
        REPLACE;
END