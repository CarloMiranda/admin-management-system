<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $subcategoryId = $_GET['id'];

        // SQL query with a JOIN statement of subcategory and category
        $sql = "SELECT s.id, s.subcategory, s.slug, s.category_id, c.category as category
                FROM subcategory s
                LEFT JOIN category c ON s.category_id = c.id
                WHERE s.id = $subcategoryId";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $subcategory = array(
                'id' => $row['id'],
                'subcategory' => $row['subcategory'],
                'slug' => $row['slug'],
                'category_id' => $row['category_id'],
                'category' => $row['category']
            );

            $json = json_encode($subcategory);
            header('Content-type: application/json');
            echo $json;
        } else {
            echo json_encode(array('error' => 'Subcategory not found'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid request. Missing subcategory ID.'));
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}

?>
