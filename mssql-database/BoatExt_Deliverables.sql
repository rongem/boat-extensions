CREATE TABLE [dbo].[BoatExt_Deliverables]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Version] INT NOT NULL, 
    [ContractId] INT NOT NULL, 
    [PriceCategoryId] INT NOT NULL,
    [Date] DATE NOT NULL, 
    [StartTime] TIME NOT NULL, 
    [EndTime] TIME NOT NULL, 
    [Duration] FLOAT NOT NULL, 
    [Key] NVARCHAR(50) NOT NULL, 
    [Text] NVARCHAR(200) NOT NULL, 
    CONSTRAINT [FK_BoatExt_Deliverables_Contract] FOREIGN KEY ([ContractId]) REFERENCES [BoatExt_Contracts]([Id]),
    CONSTRAINT [FK_BoatExt_Deliverables_PriceCategory] FOREIGN KEY ([PriceCategoryId]) REFERENCES [BoatExt_PriceCategories]([Id]),
)
