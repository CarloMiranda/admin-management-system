<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON data from the request payload
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract category ID from the data
    $categoryId = $data['id'];

    // Prepare and execute the DELETE query
    $deleteSql = "DELETE FROM category WHERE id = ?";
    $stmtDelete = $conn->prepare($deleteSql);
    $stmtDelete->bind_param("i", $categoryId);

    if ($stmtDelete->execute()) {
        $response = array(
            'success' => true,
            'message' => 'Category deleted successfully.'
        );
        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Failed to delete category. Error: ' . $conn->error
        );
        echo json_encode($response);
    }
} else {
    // Return an error response for invalid requests
    http_response_code(400); // Bad Request
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>
