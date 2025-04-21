// Main JavaScript for Bates Digital and Computational Studies Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the components
    initializeNavigation();
    initializeSearch();
    initializeProfileButtons();
    initializeOpportunityFilters();
});

// Navigation functionality
function initializeNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.main-nav li a');
    
    // Add click event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // If the link points to an ID on the page, smooth scroll to it
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-container');
    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('button');
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });
}

// Simulated search function
function performSearch(query) {
    if (query.trim() === '') {
        alert('Please enter a search term');
        return;
    }
    
    // In a real implementation, this would perform an actual search
    // For now, we're just showing an alert
    alert(`Searching for: ${query}`);
    
    // Example of how this would work with a real backend:
    // fetch('/api/search?q=' + encodeURIComponent(query))
    //    .then(response => response.json())
    //    .then(data => {
    //        displaySearchResults(data);
    //    })
    //    .catch(error => {
    //        console.error('Error performing search:', error);
    //    });
}

// Contact/Profile button functionality
function initializeProfileButtons() {
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const profileName = this.closest('.profile-details').querySelector('h4').textContent;
            
            // If this is a "View Profile" button
            if (this.textContent === 'View Profile') {
                e.preventDefault();
                
                // Simulate opening a profile page
                alert(`Opening profile for ${profileName}`);
                
                // In a real implementation:
                // window.location.href = '/profiles/' + profileId;
            }
            
            // If this is a "Contact" button
            if (this.textContent === 'Contact') {
                e.preventDefault();
                
                // Simulate opening a contact form
                alert(`Opening contact form for ${profileName}`);
                
                // In a real implementation, this might open a modal with a contact form
                // openContactModal(profileId);
            }
        });
    });
}

// Opportunity filtering functionality
function initializeOpportunityFilters() {
    // This would be implemented if there were filter options on the page
    // For now, we're just setting up the structure
    
    // Example of how this might work:
    // const filterButtons = document.querySelectorAll('.filter-btn');
    // 
    // filterButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         const filterType = this.getAttribute('data-filter');
    //         filterOpportunities(filterType);
    //     });
    // });
}

// Function to filter opportunities (would be implemented with actual data)
function filterOpportunities(filterType) {
    // Get all opportunity items
    const opportunityItems = document.querySelectorAll('.opportunity-item');
    
    opportunityItems.forEach(item => {
        // Get the category of this item
        const category = item.getAttribute('data-category');
        
        // Show/hide based on filter
        if (filterType === 'all' || category === filterType) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Lazy load images for better performance
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Create an intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    // Observe each image
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// Function to handle showing/hiding sections based on navigation
function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        // If section not found, show the first section as default
        allSections[0].style.display = 'block';
    }
}