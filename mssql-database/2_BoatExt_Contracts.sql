USE [BOAT]
GO

/****** Object:  Table [DV5_Controlling].[BoatExt_Contracts]    Script Date: 12.06.2021 11:19:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [DV5_Controlling].[BoatExt_Contracts](
	[Id] [int] NOT NULL,
	[Description] [nvarchar](200) NOT NULL,
	[Start] [date] NOT NULL,
	[End] [date] NOT NULL,
	[Organization] [nvarchar](50) NOT NULL,
	[OrganizationalUnit] [nvarchar](20) NOT NULL,
	[ResponsiblePerson] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


