<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// $name = $inData["Name"];
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE Name =? AND UserID =? AND Phone =? AND Email =?");
		$stmt->bind_param("ssss", $inData["Name"], $inData["UserId"], $inData["Phone"], $inData["Email"]);
		$stmt->execute();


		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"Name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
