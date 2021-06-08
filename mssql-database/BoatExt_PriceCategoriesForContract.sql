CREATE TABLE [dbo].[BoatExt_PriceCategoriesForContract]
(
	[ContractId] INT NOT NULL , 
    [PriceCategoryId] INT NOT NULL, 
    [AvailableUnits] FLOAT NOT NULL, 
    PRIMARY KEY ([PriceCategoryId], [ContractId]),
    CONSTRAINT [FK_BoatExt_PCC_Contract] FOREIGN KEY ([ContractId]) REFERENCES [BoatExt_Contracts]([Id]),
    CONSTRAINT [FK_BoatExt_PCC_PriceCategory] FOREIGN KEY ([PriceCategoryId]) REFERENCES [BoatExt_PriceCategories]([Id]),
)
