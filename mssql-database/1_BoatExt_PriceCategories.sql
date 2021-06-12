USE [BOAT]
GO

/****** Object:  Table [DV5_Controlling].[BoatExt_PriceCategories]    Script Date: 12.06.2021 11:19:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [DV5_Controlling].[BoatExt_PriceCategories](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[PricePerUnit] [float] NOT NULL,
	[MinutesPerDay] [float] NOT NULL,
 CONSTRAINT [PK__BoatExt___3214EC07B9FBE309] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


