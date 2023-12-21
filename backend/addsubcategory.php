<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the JSON payload
    $subcategory = $data["subcategory"];
    $slug = $data['slug'];
    $category_id = $data["category_id"];

    // Check if category exists using prepared statement to prevent SQL injection
    $checkSql = "SELECT * FROM subcategory WHERE subcategory = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("s", $subcategory);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows === 0) {
        // Insert category into the database
        $insertSql = "INSERT INTO subcategory (subcategory, slug, category_id) VALUES (?, ?, ?)";
        $stmtInsert = $conn->prepare($insertSql);
        $stmtInsert->bind_param("ssi", $subcategory, $slug, $category_id);

        if ($stmtInsert->execute()) {
            $response = array(
                'success' => true,
                'message' => 'Added successfully.'
            );

            echo json_encode($response);
        } else {
            $response = array(
                'success' => false,
                'message' => 'Failed to add subcategory. Error: ' . $conn->error
            );
            echo json_encode($response);
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Subcategory already exists.'
        );
        echo json_encode($response);
    }
    
} else {
    // Return an error response for invalid requests
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>