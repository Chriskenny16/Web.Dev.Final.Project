// JavaScript for the Internship and Career Opportunities Page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the filters functionality
    initializeFilters();
});

// Function to initialize the opportunity filters
function initializeFilters() {
    const filterButton = document.getElementById('filter-button');
    const opportunityTypeSelect = document.getElementById('opportunity-type');
    const careerAreaSelect = document.getElementById('career-area');
    const locationSelect = document.getElementById('location');
    
    // Add event listener to the filter button
    filterButton.addEventListener('click', function() {
        // Get the selected values
        const typeFilter = opportunityTypeSelect.value;
        const areaFilter = careerAreaSelect.value;
        const locationFilter = locationSelect.value;
        
        // Apply the filters
        filterOpportunities(typeFilter, areaFilter, locationFilter);
    });
    
    // Also apply filters when selects change (optional for better UX)
    opportunityTypeSelect.addEventListener('change', applyCurrentFilters);
    careerAreaSelect.addEventListener('change', applyCurrentFilters);
    locationSelect.addEventListener('change', applyCurrentFilters);
}

// Function to apply current filter values
function applyCurrentFilters() {
    const typeFilter = document.getElementById('opportunity-type').value;
    const areaFilter = document.getElementById('career-area').value;
    const locationFilter = document.getElementById('location').value;
    
    filterOpportunities(typeFilter, areaFilter, locationFilter);
}

// Function to filter the opportunities based on selected criteria
function filterOpportunities(typeFilter, areaFilter, locationFilter) {
    // Get all opportunity items
    const opportunityItems = document.querySelectorAll('.opportunity-item');
    
    // Loop through each item and check if it matches the filters
    opportunityItems.forEach(item => {
        // Get the data attributes for this item
        const itemType = item.getAttribute('data-type');
        const itemArea = item.getAttribute('data-area');
        const itemLocation = item.getAttribute('data-location');
        
        // Check if this item matches all the applied filters
        const matchesType = typeFilter === 'all' || itemType === typeFilter;
        const matchesArea = areaFilter === 'all' || itemArea === areaFilter;
        const matchesLocation = locationFilter === 'all' || itemLocation === locationFilter;
        
        // Show/hide based on whether all filters match
        if (matchesType && matchesArea && matchesLocation) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update the visibility of category headers
    updateCategoryVisibility();
}

// Function to update category visibility based on visible items
function updateCategoryVisibility() {
    const categories = document.querySelectorAll('.opportunity-category');
    
    categories.forEach(category => {
        // Get all opportunity items in this category
        const items = category.querySelectorAll('.opportunity-item');
        
        // Check if any items are visible
        let hasVisibleItems = false;
        items.forEach(item => {
            if (item.style.display !== 'none') {
                hasVisibleItems = true;
            }
        });
        
        // Show/hide the category based on whether it has visible items
        if (hasVisibleItems) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

// Function to handle applying for an opportunity
document.addEventListener('click', function(e) {
    // Check if the clicked element is an apply button
    if (e.target.classList.contains('apply-btn')) {
        e.preventDefault();
        
        // Get the opportunity details
        const opportunityItem = e.target.closest('.opportunity-item');
        const positionTitle = opportunityItem.querySelector('h4').textContent;
        const companyName = opportunityItem.querySelector('.company-name').textContent;
        
        // Show application confirmation (in a real implementation, this might redirect to an application form)
        showApplicationModal(positionTitle, companyName);
    }
});

// Function to show an application modal/popup
function showApplicationModal(position, company) {
    // In a real implementation, this would open a modal with an application form
    // For now, we'll just show an alert
    alert(`You are applying for the position of ${position} at ${company}. In a real implementation, this would open an application form.`);
    
    // Example of how this might work with a real modal:
    // const modal = document.getElementById('application-modal');
    // document.getElementById('modal-position').textContent = position;
    // document.getElementById('modal-company').textContent = company;
    // modal.style.display = 'block';
}

// Function to add "New" badges to recent opportunities
function markRecentOpportunities() {
    // Get the current date
    const currentDate = new Date();
    
    // Define what "recent" means (e.g., posted within the last 7 days)
    const recentThreshold = 7; // days
    
    // In a real implementation, each opportunity would have a "posted date" data attribute
    // For this example, we'll just add the badge to a couple of items
    const recentItems = document.querySelectorAll('.opportunity-item[data-recent="true"]');
    
    recentItems.forEach(item => {
        // Create a "New" badge element
        const newBadge = document.createElement('span');
        newBadge.className = 'new-badge';
        newBadge.textContent = 'New';
        
        // Add it to the opportunity header
        const header = item.querySelector('.opportunity-header');
        header.appendChild(newBadge);
    });
}

// Call the function to mark recent opportunities when the page loads
document.addEventListener('DOMContentLoaded', function() {
    markRecentOpportunities();
});