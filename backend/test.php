<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract data from the POST request
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $origprice = $_POST['origprice'];
    $sku = $_POST['sku'];
    $barcode = $_POST['barcode'];
    $qty = $_POST['qty'];
    $status = $_POST['status'];
    $featured_product = $_POST['featured_product'];
    $brand_id = $_POST['brand_id'];
    $subcategory_id = $_POST['subcategory_id'];
    $category_id = $_POST['category_id'];

    // File upload handling
    $targetDir = "uploads/";
    $targetFile = $targetDir . basename($_FILES["image"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if the image file is a valid image
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check === false) {
        echo json_encode(array('success' => false, 'message' => 'File is not an image.'));
        $uploadOk = 0;
    }

    // Check if the file already exists
    if (file_exists($targetFile)) {
        echo json_encode(array('success' => false, 'message' => 'File already exists.'));
        $uploadOk = 0;
    }

    // Check file size (adjust the limit based on your requirements)
    if ($_FILES["image"]["size"] > 500000) {
        echo json_encode(array('success' => false, 'message' => 'File is too large.'));
        $uploadOk = 0;
    }

    // Allow only specific image file formats (you can extend this list if needed)
    $allowedFormats = array("jpg", "jpeg", "png", "gif");
    if (!in_array($imageFileType, $allowedFormats)) {
        echo json_encode(array('success' => false, 'message' => 'Invalid file format.'));
        $uploadOk = 0;
    }

    // If $uploadOk is set to 0, there was an error with the file upload
    if ($uploadOk == 0) {
        echo json_encode(array('success' => false, 'message' => 'File upload failed.'));
    } else {
        // If everything is ok, try to upload the file
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            // Insert product data into the database
            $sql = "INSERT INTO products (name, description, image, price, origprice, sku, barcode, qty, status, featured_product, brand_id, subcategory_id, category_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param(
                "ssssssssiiii",
                $name,
                $description,
                $targetFile,
                $price,
                $origprice,
                $sku,
                $barcode,
                $qty,
                $status,
                $featured_product,
                $brand_id,
                $subcategory_id,
                $category_id
            );

            if ($stmt->execute()) {
                echo json_encode(array('success' => true, 'message' => 'Product added successfully.'));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Failed to add product.'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error uploading file.'));
        }
    }
} else {
    // Return an error response for invalid requests
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>
