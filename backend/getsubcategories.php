<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT s.id, s.subcategory, s.slug, s.status, s.category_id, c.category as category
            FROM subcategory s
            LEFT JOIN category c ON s.category_id = c.id";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $subcategory = array();

        while($row = $result->fetch_assoc()) {
            $getsubcategory = array(
                'id' => $row['id'],
                'subcategory' => $row['subcategory'],
                'slug' => $row['slug'],
                'status' => $row['status'],
                'category_id' => $row['category_id'],
                'category' => $row['category']
            );
            $subcategory[] = $getsubcategory;
        }
        $json = json_encode($subcategory);
        header('Content-type: application/json');
        echo $json;
    } else {
        echo "No subcategorys found";
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}

?>