<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from the JSON payload
    $id = $data['id'];
    $brand = $data['brand'];
    $slug = $data['slug'];

    // Check if the brand already exists
    $checkSql = "SELECT id FROM brand WHERE brand = ? AND id != ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("si", $brand, $id);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0 ) {
        $response = array(
            'success' => false,
            'message' => 'brand already exists.' . $conn->error
        );
        echo json_encode($response);

    } else {
        // Check if the data has changed
        $checkChangeSql = "SELECT brand, slug FROM brand WHERE id = ?";
        $stmtCheckChange = $conn->prepare($checkChangeSql);
        $stmtCheckChange->bind_param("i", $id);
        $stmtCheckChange->execute();
        $resultCheckChange = $stmtCheckChange->get_result();

        if ($resultCheckChange->num_rows > 0) {
            $row = $resultCheckChange->fetch_assoc();

            // Check if the data is unchanged
            if ($brand === $row['brand'] && $slug === $row['slug']) {
                $response = array(
                    'success' => true,
                    'message' => 'No changes detected.'
                );
                echo json_encode($response);
            } else {
                // Update brand in the database
                $updateSql = "UPDATE brand SET brand = ?, slug = ?, updated_at = NOW() WHERE id = ?";
                $stmtUpdate = $conn->prepare($updateSql);
                $stmtUpdate->bind_param("ssi", $brand, $slug, $id);

                if ($stmtUpdate->execute()) {
                    $response = array(
                        'success' => true,
                        'message' => 'brand updated successfully.'
                    );
                    echo json_encode($response);
                } else {
                    $response = array(
                        'success' => false,
                        'message' => 'Failed to update brand. Error: ' . $conn->error
                    );
                    echo json_encode($response);
                }
            }
        } else {
            $response = array(
                'success' => false,
                'message' => 'Brand not found.'
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
