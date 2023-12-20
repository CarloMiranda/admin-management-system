
// Define the API endpoint
const endpoint = "http://localhost/management-system/backend/";

// Store form variables
try {
    //Get the login form
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', login);
} catch (e) {};

// Logout button
try {
    const logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', logout);
} catch (e) {};

// Add Category button
try {
    const categoryBtn = document.querySelector('#category-btn');
    categoryBtn.addEventListener('click', addCategory);
} catch (e) {}

// Add brand button
try {
    const brandBtn = document.querySelector('#brand-btn');
    brandBtn.addEventListener('click', addBrand);
} catch (e) {}

// Add item button
try {
    const itemBtn = document.querySelector('#add-item-btn');
    itemBtn.addEventListener('click', addItem);
} catch (e) {}


// -----------------------------------------\\
//     Function to handle login
//------------------------------------------//
function login(event) {
    //Prevent the default form submission behavior
    event.preventDefault();

    // Get form data
    const admin = document.querySelector('#admin').value;
    const password = document.querySelector('#password').value;

    // Make a POST request to the login endpoint
    fetch (endpoint + 'login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify ({
            admin: admin,
            password: password,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.replace('dashboard.html');
        } else {
            alert(data.message);
        }
    })
};


// -----------------------------------------\\
//     Function to handle logout
//------------------------------------------//
function logout() {
    fetch(endpoint + "logout.php")
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        window.location.replace('login.html');
    })
    
};

// -----------------------------------------\\
//     Function to handle add category
//------------------------------------------// 
function addCategory() {
    const categoryNameInput = document.querySelector('#new-category');
    const slugInput = document.querySelector('#new-slug');

    // Get the category name from the input
    const newCategory = categoryNameInput.value;

    // Check if the input is filled
    if (!newCategory.trim()) {
        alert("Please enter a category name");
        return;
    }

    // Generate a slug from the category name
    const newSlug = generateSlug(newCategory);

    // Update the slug input
    slugInput.value = newSlug;

    // Make the API request
    fetch(endpoint + "addcategory.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            category: newCategory,
            slug: newSlug  // Include the slug in the request payload
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);

        // Clear input fields
        categoryNameInput.value = "";
        slugInput.value = "";
    });
}

// -----------------------------------------\\
//     Function to handle add Brand
//------------------------------------------// 
function addBrand() {
    const categoryOption = document.querySelector('#select-category').value;
    const brandNameInput = document.querySelector('#new-brand');
    const slugInput = document.querySelector('#new-slug');

    // Get the brand name from the input
    const newBrand = brandNameInput.value;

    // Check if the input is filled
    if (categoryOption == 0) {
        alert("Please select a category");
        return;
    } else if (!newBrand.trim()) {
        alert("Please enter a brand name");
        return;
    }

    // Generate a slug from the brand name
    const newSlug = generateSlug(newBrand);

    // Update the slug input
    slugInput.value = newSlug;

    // Make the API request
    fetch(endpoint + "addbrand.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            brand: newBrand,
            slug: newSlug,  // Include the slug in the request payload
            category_id: categoryOption
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);

        // Clear input fields
        brandNameInput.value = "";
        slugInput.value = "";
        getCategory();
    });
}


// -----------------------------------------\\
//     Function to generate a slug from a string
//------------------------------------------//  
function generateSlug(str) {
    return str
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '') // Remove non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+/, '') // Remove leading hyphens
        .replace(/-+$/, ''); // Remove trailing hyphens
}


// -----------------------------------------\\
//     Function to handle get category
//------------------------------------------// 
function getCategory() {
    const categoryTableBody = document.querySelector('#categoryTableBody');

    fetch(endpoint + "getcategory.php")
    .then((response) => response.json())
    .then((data) => {
        if (window.location.href.includes("categories.html")) {
            let categoryTable = "";
                data.forEach((category) => {
                    categoryTable += `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.category}</td>
                        <td>${category.slug}</td>
                        <td>
                            <button class="btn" style="padding: 0;" 
                                onclick="upStatusCategory(${category.id}, '${category.status}')">
                                ${category.status === "active" ? 
                                    '<svg class="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' 
                                    : 
                                    '<svg class="text-danger h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                }
                            </button>
                        </td>
                    
                        <td>
                            <a href="#">
                                <svg class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </a>
                            <a onClick="deleteCategory(${category.id})" class="text-danger w-4 h-4 mr-1">
                                <svg wire:loading.remove.delay="" wire:target="" class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path	ath fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    `
                });
                categoryTableBody.innerHTML = `
                ${categoryTable}`
                
            console.log(data)

        } else if (window.location.href.includes("dashboard.html")) {

            document.querySelector('#total-category').innerHTML = `
            <h3>${data.length}</h3>
            <p>Total Category</p>`
        } else if (window.location.href.includes("create-brand.html")) {
            let categoryOption = "";
                data.forEach((category) => {
                    categoryOption += `
                        <option value="${category.id}">${category.category}</option>
                    `
                });
                document.querySelector('#select-category').innerHTML = `
                    <option value="0" selected>Choose Category</option>
                    ${categoryOption}
                `
        }
        
    });
}

// -----------------------------------------\\
//     Function to handle delete category
//------------------------------------------// 
function deleteCategory(categoryId) {
    // Make a DELETE request to deletecategory.php
    fetch(endpoint + 'deletecategory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: categoryId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful deletion
            getCategory();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error deleting category:', error));
}


// -----------------------------------------\\
//     Function to handle update status category
//------------------------------------------// 
function upStatusCategory(categoryId, currentStatus) {
    // Make a POST request to updatecategorystatus.php
    fetch(endpoint + 'updatecategorystatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: categoryId,
            status: currentStatus,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful status update
            getCategory();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error toggling category status:', error));
}


// -----------------------------------------\\
//     Function to handle get brand
//------------------------------------------// 
function getBrand() {
    const brandTableBody = document.querySelector('#brandTableBody');

    fetch(endpoint + "getbrand.php")
    .then((response) => response.json())
    .then((data) => {

        if (window.location.href.includes("brands.html")) {
            let brandOption = "";
                data.forEach((brand) => {
                    brandOption += `
                    <tr>
                        <td>${brand.id}</td>
                        <td>${brand.brand}</td>
                        <td>${brand.slug}</td>
                        <td>
                            <button class="btn" style="padding: 0;" 
                                onclick="upStatusBrand(${brand.id}, '${brand.status}')">
                                ${brand.status === "active" ? 
                                    '<svg class="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' 
                                    : 
                                    '<svg class="text-danger h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                }
                            </button>
                        </td>
                    
                        <td>
                            <a href="#">
                                <svg class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </a>
                            <a onClick="deleteBrand(${brand.id})" class="text-danger w-4 h-4 mr-1">
                                <svg wire:loading.remove.delay="" wire:target="" class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path	ath fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    `
            });
            brandTableBody.innerHTML = `
            ${brandOption}`

        } else if (window.location.href.includes("dashboard.html")) {
            
            document.querySelector('#total-brand').innerHTML = `
                <h3>${data.length}</h3>
                <p>Total Brand</p>`
        }
        
    });
}

// -----------------------------------------\\
//     Function to handle delete brand
//------------------------------------------// 
function deleteBrand(brandId) {
    // Make a DELETE request to deletebrand.php
    fetch(endpoint + 'deletebrand.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: brandId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful deletion
            getBrand();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error deleting brand:', error));
}


// -----------------------------------------\\
//     Function to handle update status brand
//------------------------------------------// 
function upStatusBrand(brandId, currentStatus) {
    // Make a POST request to updatebrandstatus.php
    fetch(endpoint + 'updatebrandstatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: brandId,
            status: currentStatus,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful status update
            getBrand();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error toggling brand status:', error));
}
