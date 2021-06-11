CREATE TABLE [BoatExt_PriceCategories]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [PricePerUnit] FLOAT NOT NULL,
    [MinutesPerDay] FLOAT NOT NULL,
)
