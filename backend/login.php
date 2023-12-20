<?php 

include "config.php";

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    $admin = $data['admin'];
    $password = $data['password'];

    // Check if admin exists
    $sql = "SELECT * FROM admin WHERE admin = '$admin'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $hashedPassword = $row['password'];

        if (password_verify($password, $hashedPassword)) {
            $response = array (
                'success' => true,
                'message' => 'Login successful!',
                'admin_id' => $row['id']
            );

            $_SESSION['admin_id'] = $row['id'];

        } else {
            $response = array(
                'success' => false,
                'message' => 'Password is incorrect.'
            );
        }

    } else {
            $response = array (
                'success' => false,
                'message' => 'Admin not found'
            );
        }

    echo json_encode($response);
} else {

        echo "Invalid request! Only POST request are allowed.";

    }

?>