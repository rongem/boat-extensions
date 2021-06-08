CREATE TABLE [dbo].[BoatExt_Contracts]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Description] NVARCHAR(200) NOT NULL, 
    [Start] DATE NOT NULL, 
    [End] DATE NOT NULL, 
    [Organization] NVARCHAR(50) NOT NULL, 
    [OrganizationalUnit] NVARCHAR(20) NOT NULL, 
    [ResponsiblePerson] NVARCHAR(50) NOT NULL
)

GO

