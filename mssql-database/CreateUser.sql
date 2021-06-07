CREATE LOGIN [username] WITH PASSWORD = 'password';
CREATE USER [username] FOR LOGIN [username];
EXEC sp_addrolemember 'db_owner', 'username',

