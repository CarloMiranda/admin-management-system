<?php

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT * FROM brand";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $brand = array();

        while($row = $result->fetch_assoc()) {
            $getbrand = array(
                'id' => $row['id'],
                'brand' => $row['brand'],
                'slug' => $row['slug'],
                'status' => $row['status']
            );
            $brand[] = $getbrand;
        }
        $json = json_encode($brand);
        header('Content-type: application/json');
        echo $json;
    } else {
        echo "No brands found";
    }
} else {
    // Return an error response for unsupported methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('success' => false, 'message' => 'Unsupported request method.'));
}

?>