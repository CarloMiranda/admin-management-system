<?php
include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the JSON payload
    $id = $data['id'];
    $category = $data['category'];
    $slug = $data['slug'];

    // Check if the category already exists
    $checkSql = "SELECT id FROM category WHERE category = ? AND id != ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("si", $category, $id);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();


    if ($resultCheck->num_rows > 0 ) {
        $response = array(
            'success' => false,
            'message' => 'Category already exists.' . $conn->error
        );
        echo json_encode($response);

    } else {
        // Update category in the database
        $updateSql = "UPDATE category SET category = ?, slug = ?, updated_at = NOW() WHERE id = ?";
        $stmtUpdate = $conn->prepare($updateSql);
        $stmtUpdate->bind_param("ssi", $category, $slug, $id);

        if ($stmtUpdate->execute()) {
            $response = array(
                'success' => true,
                'message' => 'Category updated successfully.'
            );

            echo json_encode($response);
        } else {
            $response = array(
                'success' => false,
                'message' => 'Failed to update category. Error: ' . $conn->error
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
