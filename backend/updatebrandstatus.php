<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON data from the request payload
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract brand ID and current status from the data
    $brandId = $data['id'];
    $currentStatus = $data['status'];

    // Calculate the new status (toggle between 'active' and 'inactive')
    $newStatus = ($currentStatus === 'active') ? 'inactive' : 'active';

    // Prepare and execute the UPDATE query
    $updateSql = "UPDATE brand SET status = ? WHERE id = ?";
    $stmtUpdate = $conn->prepare($updateSql);
    $stmtUpdate->bind_param("si", $newStatus, $brandId);

    if ($stmtUpdate->execute()) {
        $response = array(
            'success' => true,
            'message' => 'Brand status updated successfully.'
        );
        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Failed to update brand status. Error: ' . $conn->error
        );
        echo json_encode($response);
    }
} else {
    // Return an error response for invalid requests
    http_response_code(400); // Bad Request
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>
