<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT * FROM category";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $category = array();

        while($row = $result->fetch_assoc()) {
            $getCategory = array(
                'id' => $row['id'],
                'category' => $row['category'],
                'slug' => $row['slug'],
                'status' => $row['status']
            );
            $category[] = $getCategory;
        }
        $json = json_encode($category);
        header('Content-type: application/json');
        echo $json;
    } else {
        echo "No categories found";
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}

?>