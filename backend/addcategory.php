<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the JSON payload
    $category = $data["category"];
    $slug = $data['slug'];

    // Check if category exists using prepared statement to prevent SQL injection
    $checkSql = "SELECT * FROM category WHERE category = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("s", $category);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows === 0) {
        // Insert category into the database
        $insertSql = "INSERT INTO category (category, slug) VALUES (?, ?)";
        $stmtInsert = $conn->prepare($insertSql);
        $stmtInsert->bind_param("ss", $category, $slug);

        if ($stmtInsert->execute()) {
            $response = array(
                'success' => true,
                'message' => 'Added successfully.'
            );

            echo json_encode($response);
        } else {
            $response = array(
                'success' => false,
                'message' => 'Failed to add category. Error: ' . $conn->error
            );
            echo json_encode($response);
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Category already exists.'
        );
        echo json_encode($response);
    }
    
} else {
    // Return an error response for invalid requests
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>
