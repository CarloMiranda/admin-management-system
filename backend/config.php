<?php   

// Start the session
session_start();

// This is ypur local settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "management-system";

// Make a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die ("Connection error: " . $conn->connect_error);
}

?>