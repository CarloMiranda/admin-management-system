<?php

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract data from the POST request
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $origPrice = $_POST['origprice'];
    $sku = $_POST['sku'];
    $barcode = $_POST['barcode'];
    $qty = $_POST['qty'];
    $status = $_POST['status'];
    $featuredProduct = $_POST['featured_product'];
    $brandId = $_POST['brand_id'];
    $subcategoryId = $_POST['subcategory_id'];
    $categoryId = $_POST['category_id'];

    // Process image uploads
    $imagePaths = array();

    foreach ($_FILES['image']['name'] as $key => $name) {
        $tmp_name = $_FILES['image']['tmp_name'][$key];
        $targetPath = "uploads/" . basename($name);

        // Check if the file already exists
        if (file_exists($targetPath)) {
            echo json_encode(array('success' => false, 'message' => 'File already exists.'));
            exit(); // Terminate script if the file already exists
        }

        // Check if the image file is a valid image
        $check = getimagesize($tmp_name);
        if ($check === false) {
            echo json_encode(array('success' => false, 'message' => 'File is not an image.'));
            exit(); // Terminate script if the file is not an image
        }

        // Check file size (adjust the limit based on your requirements)
        if ($_FILES["image"]["size"][$key] > 500000) {
            echo json_encode(array('success' => false, 'message' => 'File is too large.'));
            exit(); // Terminate script if the file is too large
        }

        // Allow only specific image file formats (you can extend this list if needed)
        $allowedFormats = array("jpg", "jpeg", "png", "gif");
        $imageFileType = pathinfo($targetPath, PATHINFO_EXTENSION);
        if (!in_array(strtolower($imageFileType), $allowedFormats)) {
            echo json_encode(array('success' => false, 'message' => 'Invalid file format.'));
            exit(); // Terminate script if the file format is invalid
        }

        move_uploaded_file($tmp_name, $targetPath);
        $imagePaths[] = $targetPath;
    }

    // Convert image paths to JSON for storage in the database
    $imagePathsJSON = json_encode($imagePaths);

    // Check if the product already exists
    $checkSql = "SELECT id FROM product WHERE sku = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("s", $sku);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        echo json_encode(array('success' => false, 'message' => 'Product already exists.'));
        exit(); // Terminate script if the product already exists
    }

    // Insert product data into the database
    $sql = "INSERT INTO product (name, description, price, origprice, sku, barcode, qty, status, 
            featured_product, brand_id, subcategory_id, category_id, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssddsiissiiii", $name, $description, $price, $origPrice, $sku, $barcode, $qty, 
                      $status, $featuredProduct, $brandId, $subcategoryId, $categoryId, $imagePathsJSON);

    if ($stmt->execute()) {
        $response = array(
            'success' => true,
            'message' => 'Product added successfully.'
        );

        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Failed to add product. Error: ' . $conn->error
        );

        echo json_encode($response);
    }

    $stmt->close();
} else {
    // Return an error response for invalid requests
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Invalid request! Only POST requests are allowed.'));
}

?>
