USE RichDB;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        Phone NVARCHAR(30) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF COL_LENGTH('dbo.Users', 'Phone') IS NULL
BEGIN
    ALTER TABLE dbo.Users ADD Phone NVARCHAR(30) NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'test@rich.com')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, Phone)
    VALUES ('Test Kullanıcı', 'test@rich.com', 'test123', '05550000000');
END
GO
