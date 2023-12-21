


function deleteSubcategory(subcategoryId) {
    // Make a DELETE request to deletesubcategory.php
    fetch(endpoint + 'deletesubcategory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: subcategoryId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful deletion
            getSubcategory();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error deleting subcategory:', error));
}