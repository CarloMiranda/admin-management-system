<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $categoryId = $_GET['id'];

        // SQL query to get all subcategories based on the category ID
        $sql = "SELECT id, subcategory, slug, category_id FROM subcategory WHERE category_id = $categoryId";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $subcategories = array();

            while ($row = $result->fetch_assoc()) {
                $subcategory = array(
                    'id' => $row['id'],
                    'subcategory' => $row['subcategory'],
                    'slug' => $row['slug'],
                    'category_id' => $row['category_id']
                );
                $subcategories[] = $subcategory;
            }

            $json = json_encode($subcategories);
            header('Content-type: application/json');
            echo $json;
        } else {
            echo json_encode(array('error' => 'No subcategories found for the given category ID.'));
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
