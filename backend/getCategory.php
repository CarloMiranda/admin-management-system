<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $categoryId = $_GET['id'];

        $sql = "SELECT * FROM category WHERE id = $categoryId";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $category = array(
                'id' => $row['id'],
                'category' => $row['category'],
                'slug' => $row['slug'],
            );

            $json = json_encode($category);
            header('Content-type: application/json');
            echo $json;
        } else {
            echo json_encode(array('error' => 'Category not found'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid request. Missing category ID.'));
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}


?>