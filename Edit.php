<?php
	<?php

	$inData = getRequestInfo();
	 
	  $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];
	  $userId = $inData["userId"];
    $searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE Name =? AND UserID =? AND Phone =? AND Email =?");
    $stmt->bind_params("ssss", $inData["userId"], $inData["oldname"], $inData["oldemail"], $inData["oldphone"]);
    $stmt->execute();
    $stmt->close();
    sleep(3);
		$stmt = $conn->prepare("INSERT INTO Contacts (UserId,Name,Phone,Email) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $userId, $name, $phone, $email);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>