<?php

	$inData = getRequestInfo();

    $newName = $inData["newName"];
    $newPhone = $inData["newPhone"];
    $newEmail = $inData["newEmail"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE Name =? AND UserID =? AND Phone =? AND Email =?");
		$stmt->bind_param("ssss", $inData["Name"], $inData["UserId"], $inData["Phone"], $inData["Email"]);
		$stmt->execute();
		$stmt->close();
		$conn->close();

        $stmt = $conn->prepare("INSERT into Contacts (UserId,Name,Phone,Email) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $userId, $newName, $newPhone, $newEmail);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
