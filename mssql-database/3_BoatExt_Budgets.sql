USE [BOAT]
GO

/****** Object:  Table [DV5_Controlling].[BoatExt_Budgets]    Script Date: 12.06.2021 11:19:00 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [DV5_Controlling].[BoatExt_Budgets](
	[ContractId] [int] NOT NULL,
	[PriceCategoryId] [int] NOT NULL,
	[AvailableUnits] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PriceCategoryId] ASC,
	[ContractId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Budgets]  WITH CHECK ADD  CONSTRAINT [FK_BoatExt_PCC_Contract] FOREIGN KEY([ContractId])
REFERENCES [DV5_Controlling].[BoatExt_Contracts] ([Id])
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Budgets] CHECK CONSTRAINT [FK_BoatExt_PCC_Contract]
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Budgets]  WITH CHECK ADD  CONSTRAINT [FK_BoatExt_PCC_PriceCategory] FOREIGN KEY([PriceCategoryId])
REFERENCES [DV5_Controlling].[BoatExt_PriceCategories] ([Id])
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Budgets] CHECK CONSTRAINT [FK_BoatExt_PCC_PriceCategory]
GO


