USE [BOAT]
GO

/****** Object:  Table [DV5_Controlling].[BoatExt_Deliverables]    Script Date: 12.06.2021 11:19:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [DV5_Controlling].[BoatExt_Deliverables](
	[Id] [int] NOT NULL,
	[Version] [int] NOT NULL,
	[ContractId] [int] NOT NULL,
	[PriceCategoryId] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[StartTime] [time](7) NULL,
	[EndTime] [time](7) NULL,
	[Duration] [float] NOT NULL,
	[Key] [nvarchar](50) NOT NULL,
	[Text] [nvarchar](MAX) NULL,
	[Person] [nvarchar](50) NULL,
 CONSTRAINT [PK__BoatExt___3214EC07ECFCEF64] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Deliverables]  WITH CHECK ADD  CONSTRAINT [FK_BoatExt_Deliverables_Contract] FOREIGN KEY([ContractId])
REFERENCES [DV5_Controlling].[BoatExt_Contracts] ([Id])
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Deliverables] CHECK CONSTRAINT [FK_BoatExt_Deliverables_Contract]
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Deliverables]  WITH CHECK ADD  CONSTRAINT [FK_BoatExt_Deliverables_PriceCategory] FOREIGN KEY([PriceCategoryId])
REFERENCES [DV5_Controlling].[BoatExt_PriceCategories] ([Id])
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Deliverables] CHECK CONSTRAINT [FK_BoatExt_Deliverables_PriceCategory]
GO


