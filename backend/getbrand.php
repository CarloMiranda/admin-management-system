<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $brandId = $_GET['id'];

        $sql = "SELECT * FROM brand WHERE id = $brandId";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $brand = array(
                'id' => $row['id'],
                'brand' => $row['brand'],
                'slug' => $row['slug'],
            );

            $json = json_encode($brand);
            header('Content-type: application/json');
            echo $json;
        } else {
            echo json_encode(array('error' => 'Brand not found'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid request. Missing brand ID.'));
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}


?>