USE [BOAT]
GO

/****** Object:  Table [DV5_Controlling].[BoatExt_Authorizations]    Script Date: 12.06.2021 11:18:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [DV5_Controlling].[BoatExt_Authorizations](
	[Username] [nvarchar](70) NOT NULL,
	[Allowed] [bit] NOT NULL,
 CONSTRAINT [PK_Authorizations] PRIMARY KEY CLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [DV5_Controlling].[BoatExt_Authorizations] ADD  DEFAULT ((0)) FOR [Allowed]
GO


