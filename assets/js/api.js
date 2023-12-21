
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

// Add Subcategory button
try {
    const subCategoryBtn = document.querySelector('#subcategory-btn');
    subCategoryBtn.addEventListener('click', addSubcategory);
} catch (e) {}

// Add brand button
try {
    const brandBtn = document.querySelector('#brand-btn');
    brandBtn.addEventListener('click', addBrand);
} catch (e) {}

// Edit category button
try {
    const editCategoryBtn = document.querySelector('#edit-category-btn');
    editCategoryBtn.addEventListener('click', editCategory);
} catch (e) {}

// Edit edit-subcategory button
try {
    const editSubcategoryBtn = document.querySelector('#edit-subcategory-btn');
    editSubcategoryBtn.addEventListener('click', editSubcategory);
} catch (e) {}

// Edit edit brand button
try {
    const editBrandBtn = document.querySelector('#edit-brand-btn');
    editBrandBtn.addEventListener('click', editBrand);
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
            slug: newSlug,  // Include the slug in the request payload
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

    fetch(endpoint + "getcategories.php")
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
                            <a href="edit-category.html?id=${category.id}">
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
                ${categoryTable}`;

            
        } else if (window.location.href.includes("dashboard.html")) {

            document.querySelector('#total-category').innerHTML = `
            <h3>${data.length}</h3>
            <p>Total Category</p>`;

        } else if (window.location.href.includes("create-subcategory.html")) {

            let categoryOption = "";
                data.forEach((category) => {
                    categoryOption += `
                        <option value="${category.id}">${category.category}</option>
                    `
                });
                document.querySelector('#select-category').innerHTML = `
                    <option value="0" selected>Choose Category</option>
                    ${categoryOption}
                `;

        } else if (window.location.href.includes("edit-subcategory.html")) {
            
            let categoryOption;
            data.forEach((category) => {
                categoryOption += `
                    <option value="${category.id}">${category.category}</option>
                `;
            });
            document.querySelector('#change-category').innerHTML = `
                <option value="0" selected>Choose Category</option>
                ${categoryOption}
            `;
        }
      
    });
}


// -----------------------------------------\\
//     Function to handle show category
//------------------------------------------//
function showCategory() {

    // Get category ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    // Fetch category data based on the ID
    fetch(endpoint + `getcategory.php?id=${categoryId}`)
        .then(response => response.json())
        .then(data => {
            
            // Populate the input fields and select options with the retrieved data
            document.querySelector('#edit-category').value = data.category;
            document.querySelector('#edit-slug').value = data.slug;
        });

}


// -----------------------------------------\\
//     Function to handle edit category
//------------------------------------------// 
function editCategory() {
    
    // Get category ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const categoryNameInput = document.querySelector('#edit-category');
    const slugInput = document.querySelector('#edit-slug');

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
        fetch(endpoint + "editcategory.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: categoryId,
                category: newCategory,
                slug: newSlug  // Include the slug in the request payload
            }),
        })
        .then((response) => response.json())
        .then((data) => {

            alert(data.message);
        
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
//     Function to handle add Subcategory
//------------------------------------------// 
function addSubcategory() {
    const categoryOption = document.querySelector('#select-category').value;
    const subcategoryNameInput = document.querySelector('#new-subcategory');
    const slugInput = document.querySelector('#new-slug');

    // Get the subcategory name from the input
    const newSubcategory = subcategoryNameInput.value;

    // Check if the input is filled
    if (categoryOption == 0) {
        alert("Please select a category");
        return;
    } else if (!newSubcategory.trim()) {
        alert("Please enter a subcategory name");
        return;
    }

    // Generate a slug from the subcategory name
    const newSlug = generateSlug(newSubcategory);

    // Update the slug input
    slugInput.value = newSlug;

    // Make the API request
    fetch(endpoint + "addsubcategory.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subcategory: newSubcategory,
            slug: newSlug,  // Include the slug in the request payload
            category_id: categoryOption
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);

        // Clear input fields
        subcategoryNameInput.value = "";
        slugInput.value = "";
        getCategory();
    });
}


// -----------------------------------------\\
//     Function to handle get subcategory
//------------------------------------------// 
function getSubcategory() {
    const subcategoryTableBody = document.querySelector('#subcategoryTableBody');

    fetch(endpoint + "getsubcategories.php")
    .then((response) => response.json())
    .then((data) => {

        if (window.location.href.includes("subcategory.html")) {
            let subcategoryOption = "";
                data.forEach((subcategory) => {
                    subcategoryOption += `
                    <tr>
                        <td>${subcategory.id}</td>
                        <td>${subcategory.subcategory}</td>
                        <td>${subcategory.slug}</td>
                        <td>${subcategory.category}</td>
                        <td>
                            <button class="btn" style="padding: 0;" 
                                onclick="upStatusSubcategory(${subcategory.id}, '${subcategory.status}')">
                                ${subcategory.status === "active" ? 
                                    '<svg class="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' 
                                    : 
                                    '<svg class="text-danger h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                }
                            </button>
                        </td>
                    
                        <td>
                            <a href="edit-subcategory.html?id=${subcategory.id}">
                                <svg class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </a>
                            <a onClick="deleteSubcategory(${subcategory.id})" class="text-danger w-4 h-4 mr-1">
                                <svg wire:loading.remove.delay="" wire:target="" class="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path	ath fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    `
            });
            subcategoryTableBody.innerHTML = `
            ${subcategoryOption}`

        } else if (window.location.href.includes("dashboard.html")) {
            
            document.querySelector('#total-subcategory').innerHTML = `
                <h3>${data.length}</h3>
                <p>Total Sub Category</p>`
        }
    });
}


// -----------------------------------------\\
//     Function to handle update status subcategory
//------------------------------------------// 
function upStatusSubcategory(SubcategoryId, currentStatus) {
    // Make a POST request to updatebrandstatus.php
    fetch(endpoint + 'updatesubcategorystatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: SubcategoryId,
            status: currentStatus,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the table after successful status update
            getSubcategory();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error toggling brand status:', error));
}


// -----------------------------------------\\
//     Function to handle edit subcategory
//------------------------------------------// 
function editSubcategory() {
    
    // Get category ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryId = urlParams.get('id');
    const subcategoryNameInput = document.querySelector('#edit-subcategory');
    const slugInput = document.querySelector('#edit-slug');
    const categoryId = document.querySelector('#change-category').value;
    const currentCategory = document.querySelector('#current-category').value;

    // Get the subcategory name from the input
    const newSubcategory = subcategoryNameInput.value;

    // Check if the input is filled
    if (!newSubcategory.trim()) {
        alert("Please enter subcategory name");
        return;
    }

    // Generate a slug from the category name
    const newSlug = generateSlug(newSubcategory);

    // Update the slug input
    slugInput.value = newSlug;

    if (categoryId == 0) {

        // Make the API request
        fetch(endpoint + "editsubcategory.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: subcategoryId,
                subcategory: newSubcategory,
                slug: newSlug, 
                category_id: currentCategory
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert("No changes detected");
            showSubcategory();
        });

    } else {

        // Make the API request
        fetch(endpoint + "editsubcategory.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: subcategoryId,
                subcategory: newSubcategory,
                slug: newSlug, 
                category_id: categoryId
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            showSubcategory();
        });

    }
}

// -----------------------------------------\\
//     Function to handle delete category
//------------------------------------------// 
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

// -----------------------------------------\\
//     Function to handle show edit subcategory
//------------------------------------------// 
function showSubcategory() {

    // Get subcategory ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryId = urlParams.get('id');
    
    // Fetch subcategory data based on the ID
    fetch(endpoint + `getsubcategory.php?id=${subcategoryId}`)
    .then(response => response.json())
    .then(data => {
        
        // Populate the input fields and select options with the retrieved data
        const currentCategory = document.querySelector('#current-category');
        currentCategory.innerHTML = data.category;
        currentCategory.value = data.category_id;
        document.querySelector('#edit-subcategory').value = data.subcategory;
        document.querySelector('#edit-slug').value = data.slug;

        data
    });
}


// -----------------------------------------\\
//     Function to handle get brand
//------------------------------------------// 
function getBrand() {
    const brandTableBody = document.querySelector('#brandTableBody');

    fetch(endpoint + "getbrands.php")
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
                            <a href="edit-brand.html?id=${brand.id}">
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
//     Function to handle show edit brand
//------------------------------------------// 
function showBrand() {

    // Get brand ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const brandId = urlParams.get('id');
    
    // Fetch brand data based on the ID
    fetch(endpoint + `getbrand.php?id=${brandId}`)
    .then(response => response.json())
    .then(data => {
        
        // Populate the input fields and select options with the retrieved data
        document.querySelector('#edit-brand').value = data.brand;
        document.querySelector('#edit-slug').value = data.slug;
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


// -----------------------------------------\\
//     Function to handle edit brand
//------------------------------------------// 
function editBrand() {
    
    // Get brand ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const brandId = urlParams.get('id');
    const brandNameInput = document.querySelector('#edit-brand');
    const slugInput = document.querySelector('#edit-slug');

    // Get the brand name from the input
    const newBrand = brandNameInput.value;

    // Check if the input is filled
    if (!newBrand.trim()) {
        alert("Please enter a brand name");
        return;
    }

    // Generate a slug from the brand name
    const newSlug = generateSlug(newBrand);

    // Update the slug input
    slugInput.value = newSlug;

    
        // Make the API request
        fetch(endpoint + "editbrand.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: brandId,
                brand: newBrand,
                slug: newSlug  // Include the slug in the request payload
            }),
        })
        .then((response) => response.json())
        .then((data) => {

            alert(data.message);
        
        });  
}
