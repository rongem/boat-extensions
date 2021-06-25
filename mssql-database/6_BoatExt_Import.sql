USE [BOAT]
GO

/****** Object:  StoredProcedure [DV5_Controlling].[BoatExt_Import]    Script Date: 12.06.2021 11:24:04 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [DV5_Controlling].[BoatExt_Import]
 AS
    DECLARE @IstDaten TABLE (
        istID varchar(10) NOT NULL,
        praefix varchar(18) NOT NULL,
        datum date NOT NULL,
        stunden float NOT NULL
    );
    INSERT INTO @IstDaten
        SELECT CONCAT('EA', id), [Key], [Date], Duration
        FROM BoatExt_Deliverables
 RETURN 0
GO


