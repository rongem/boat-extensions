CREATE TABLE [dbo].[BoatExt_PriceCategories]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [PricePerUnit] INT NOT NULL,
    [MinutesPerDay] INT NOT NULL,
)
