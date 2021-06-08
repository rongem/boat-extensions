CREATE PROCEDURE [dbo].[BoatExt_Import]
AS
	DECLARE @IstDaten TABLE (
		istID varchar(10) NOT NULL,
		praefix varchar(18) NOT NULL,
		datum date NOT NULL,
		stunden float NOT NULL
	);


	INSERT INTO @IstDaten
		SELECT 'EA' + id, [Key], [Date], Duration
		FROM BoatExt_Deliverables
RETURN 0
