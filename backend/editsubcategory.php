<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the JSON payload
    $id = $data['id'];
    $subcategory = $data['subcategory'];
    $slug = $data['slug'];
    $category_id = $data['category_id'];

    // Check if the subcategory already exists
    $checkSql = "SELECT id FROM subcategory WHERE subcategory = ? AND id != ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("si", $subcategory, $id);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();


    if ($resultCheck->num_rows > 0 ) {
        $response = array(
            'success' => false,
            'message' => 'subcategory already exists.' . $conn->error
        );
        echo json_encode($response);

    } else {
        // Update subcategory in the database
        $updateSql = "UPDATE subcategory SET subcategory = ?, slug = ?, category_id = ?, updated_at = NOW() WHERE id = ?";
        $stmtUpdate = $conn->prepare($updateSql);
        $stmtUpdate->bind_param("ssii", $subcategory, $slug, $category_id, $id);

        if ($stmtUpdate->execute()) {
            $response = array(
                'success' => true,
                'message' => 'Subcategory updated successfully.'
            );

            echo json_encode($response);
        } else {
            $response = array(
                'success' => false,
                'message' => 'Failed to update subcategory. Error: ' . $conn->error
            );
            echo json_encode($response);
        }
    }
} else {
    // Return an error response for invalid requests
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}
?>
