// Main JavaScript for Bates DCS Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('.header-container');
    header.appendChild(mobileNavToggle);
    
    const mainNav = document.querySelector('.main-nav ul');
    const submenuNav = document.querySelector('.submenu-nav ul');
    
    mobileNavToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        if (submenuNav) {
            submenuNav.classList.toggle('active');
        }
        
        // Toggle icon
        if (mainNav.classList.contains('active')) {
            mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Add mobile nav styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media screen and (max-width: 768px) {
            .mobile-nav-toggle {
                display: block;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                position: absolute;
                top: 20px;
                right: 20px;
            }
            
            .main-nav ul {
                display: none;
            }
            
            .main-nav ul.active {
                display: flex;
            }
            
            .submenu-nav ul {
                display: none;
            }
            
            .submenu-nav ul.active {
                display: flex;
            }
        }
        
        @media screen and (min-width: 769px) {
            .mobile-nav-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    
    if (submenuNav) {
        const submenuLinks = submenuNav.querySelectorAll('a');
        submenuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.parentElement.classList.add('active');
            }
        });
    }
}); 