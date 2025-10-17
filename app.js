// Mock Application Data
const mockApplications = [
    {
        id: 1,
        company: "Google",
        role: "Senior Software Engineer",
        status: "interview",
        dateApplied: "2025-10-10",
        description: "Full-stack development role"
    },
    {
        id: 2,
        company: "Meta",
        role: "Frontend Developer",
        status: "pending",
        dateApplied: "2025-10-12",
        description: "React and React Native development"
    },
    {
        id: 3,
        company: "Amazon",
        role: "Cloud Solutions Architect",
        status: "interview",
        dateApplied: "2025-10-08",
        description: "AWS infrastructure design"
    },
    {
        id: 4,
        company: "Apple",
        role: "iOS Developer",
        status: "accepted",
        dateApplied: "2025-10-05",
        description: "Swift and SwiftUI development"
    },
    {
        id: 5,
        company: "Microsoft",
        role: "DevOps Engineer",
        status: "pending",
        dateApplied: "2025-10-14",
        description: "Azure cloud and CI/CD"
    },
    {
        id: 6,
        company: "Netflix",
        role: "Backend Engineer",
        status: "rejected",
        dateApplied: "2025-10-01",
        description: "Microservices architecture"
    },
    {
        id: 7,
        company: "Tesla",
        role: "Full Stack Developer",
        status: "interview",
        dateApplied: "2025-10-11",
        description: "Energy management systems"
    },
    {
        id: 8,
        company: "Spotify",
        role: "Machine Learning Engineer",
        status: "pending",
        dateApplied: "2025-10-13",
        description: "Music recommendation systems"
    },
    {
        id: 9,
        company: "Airbnb",
        role: "Product Designer",
        status: "pending",
        dateApplied: "2025-10-15",
        description: "User experience design"
    },
    {
        id: 10,
        company: "Uber",
        role: "Data Engineer",
        status: "interview",
        dateApplied: "2025-10-09",
        description: "Big data processing"
    },
    {
        id: 11,
        company: "Twitter",
        role: "Security Engineer",
        status: "rejected",
        dateApplied: "2025-09-28",
        description: "Application security"
    },
    {
        id: 12,
        company: "LinkedIn",
        role: "Software Engineer",
        status: "pending",
        dateApplied: "2025-10-16",
        description: "Professional networking features"
    },
    {
        id: 13,
        company: "Salesforce",
        role: "Cloud Developer",
        status: "interview",
        dateApplied: "2025-10-07",
        description: "CRM platform development"
    },
    {
        id: 14,
        company: "Adobe",
        role: "UI/UX Engineer",
        status: "pending",
        dateApplied: "2025-10-14",
        description: "Creative Cloud applications"
    },
    {
        id: 15,
        company: "Oracle",
        role: "Database Administrator",
        status: "rejected",
        dateApplied: "2025-09-25",
        description: "Enterprise database management"
    },
    {
        id: 16,
        company: "Dropbox",
        role: "Platform Engineer",
        status: "accepted",
        dateApplied: "2025-10-03",
        description: "File storage infrastructure"
    },
    {
        id: 17,
        company: "Stripe",
        role: "Payment Systems Engineer",
        status: "interview",
        dateApplied: "2025-10-12",
        description: "Financial API development"
    },
    {
        id: 18,
        company: "Slack",
        role: "Frontend Developer",
        status: "pending",
        dateApplied: "2025-10-15",
        description: "Real-time collaboration tools"
    },
    {
        id: 19,
        company: "Zoom",
        role: "Video Engineer",
        status: "pending",
        dateApplied: "2025-10-16",
        description: "Video streaming technology"
    },
    {
        id: 20,
        company: "Shopify",
        role: "E-commerce Developer",
        status: "interview",
        dateApplied: "2025-10-10",
        description: "Online store platform"
    }
];

// Application State
let applications = [...mockApplications];
let currentFilter = 'all';
let touchStartX = 0;
let touchStartY = 0;
let pullStartY = 0;
let isPulling = false;

// DOM Elements
const applicationsFeed = document.getElementById('applicationsFeed');
const statsHeader = document.getElementById('statsHeader');
const headerToggle = document.getElementById('headerToggle');
const fabButton = document.getElementById('fabButton');
const filterModal = document.getElementById('filterModal');
const closeModal = document.getElementById('closeModal');
const filterButtons = document.querySelectorAll('.filter-btn');
const activeFilter = document.getElementById('activeFilter');
const clearFilter = document.getElementById('clearFilter');
const filterText = document.getElementById('filterText');
const emptyState = document.getElementById('emptyState');
const pullToRefresh = document.getElementById('pullToRefresh');
const swipeHint = document.getElementById('swipeHint');

// Status Icons
const statusIcons = {
    pending: 'fa-clock',
    interview: 'fa-user-tie',
    rejected: 'fa-times-circle',
    accepted: 'fa-check-circle'
};

// Initialize App
function init() {
    renderApplications();
    updateStats();
    setupEventListeners();
    setTimeout(() => {
        if (swipeHint) {
            swipeHint.style.display = 'none';
        }
    }, 4000);
}

// Render Applications
function renderApplications() {
    const filteredApps = currentFilter === 'all' 
        ? applications 
        : applications.filter(app => app.status === currentFilter);

    if (filteredApps.length === 0) {
        applicationsFeed.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    applicationsFeed.style.display = 'grid';
    emptyState.style.display = 'none';
    
    applicationsFeed.innerHTML = filteredApps.map(app => `
        <div class="application-card" data-id="${app.id}" data-status="${app.status}">
            <div class="card-header">
                <div class="company-info">
                    <div class="company-name">${app.company}</div>
                    <div class="role-title">${app.role}</div>
                </div>
                <div class="status-badge ${app.status}">
                    <i class="fas ${statusIcons[app.status]}"></i>
                    ${app.status}
                </div>
            </div>
            <div class="card-body">
                <div class="date-applied">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Applied: ${formatDate(app.dateApplied)}</span>
                </div>
                <button class="view-details-btn" onclick="viewDetails(${app.id})">
                    <span>View Details</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Add swipe listeners to cards
    const cards = document.querySelectorAll('.application-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: true });
    });

    // Update filter display
    updateFilterDisplay();
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update Stats
function updateStats() {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const interviews = applications.filter(app => app.status === 'interview').length;

    document.getElementById('totalApps').textContent = total;
    document.getElementById('pendingApps').textContent = pending;
    document.getElementById('interviewApps').textContent = interviews;
}

// Update Filter Display
function updateFilterDisplay() {
    if (currentFilter === 'all') {
        activeFilter.classList.add('hidden');
    } else {
        activeFilter.classList.remove('hidden');
        const filterNames = {
            pending: 'Pending',
            interview: 'Interviews',
            rejected: 'Rejected',
            accepted: 'Accepted'
        };
        filterText.textContent = filterNames[currentFilter] || 'All Applications';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Header Toggle
    headerToggle.addEventListener('click', () => {
        statsHeader.classList.toggle('collapsed');
    });

    // FAB Button
    fabButton.addEventListener('click', () => {
        filterModal.classList.add('active');
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        filterModal.classList.remove('active');
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            currentFilter = filter;
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-render applications
            renderApplications();
            
            // Close modal
            filterModal.classList.remove('active');
        });
    });

    // Clear Filter
    clearFilter.addEventListener('click', () => {
        currentFilter = 'all';
        filterButtons.forEach(b => b.classList.remove('active'));
        filterButtons[0].classList.add('active');
        renderApplications();
    });

    // Close modal on backdrop click
    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
        }
    });

    // Pull to Refresh
    let startY = 0;
    let scrollTop = 0;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].pageY;
        const pullDistance = currentY - startY;

        if (scrollTop <= 0 && pullDistance > 0) {
            isPulling = true;
            if (pullDistance > 80) {
                pullToRefresh.classList.add('visible');
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (isPulling) {
            isPulling = false;
            if (pullToRefresh.classList.contains('visible')) {
                refreshApplications();
            }
        }
    }, { passive: true });
}

// Swipe Gesture Handlers
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;

    const card = e.currentTarget;
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        e.preventDefault();
        card.classList.add('swiping');
        card.style.transform = `translateX(${diffX * 0.3}px)`;
    }
}

function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;

    const card = e.currentTarget;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    const status = card.dataset.status;

    card.classList.remove('swiping');
    card.style.transform = '';

    // Swipe threshold
    if (Math.abs(diffX) > 100) {
        if (diffX > 0) {
            // Swipe right - next status
            filterBySwipe('right', status);
        } else {
            // Swipe left - previous status
            filterBySwipe('left', status);
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

// Filter by Swipe
function filterBySwipe(direction, currentStatus) {
    const statuses = ['pending', 'interview', 'rejected', 'accepted'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    let newIndex;
    if (direction === 'right') {
        newIndex = (currentIndex + 1) % statuses.length;
    } else {
        newIndex = (currentIndex - 1 + statuses.length) % statuses.length;
    }
    
    const newFilter = statuses[newIndex];
    currentFilter = newFilter;
    
    // Update filter buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === newFilter) {
            btn.classList.add('active');
        }
    });
    
    renderApplications();
    
    // Show feedback
    showSwipeFeedback(newFilter);
}

// Show Swipe Feedback
function showSwipeFeedback(filter) {
    const filterNames = {
        pending: 'Pending Applications',
        interview: 'Interview Applications',
        rejected: 'Rejected Applications',
        accepted: 'Accepted Applications'
    };
    
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'swipe-hint';
    feedback.innerHTML = `<i class="fas fa-filter"></i> <span>Filtered: ${filterNames[filter]}</span>`;
    feedback.style.animation = 'slideInDown 0.3s ease, fadeOut 0.3s ease 1.5s forwards';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Refresh Applications
function refreshApplications() {
    pullToRefresh.querySelector('span').textContent = 'Refreshing...';
    
    setTimeout(() => {
        // Simulate data refresh
        applications = [...mockApplications].sort(() => Math.random() - 0.5);
        renderApplications();
        updateStats();
        
        pullToRefresh.classList.remove('visible');
        pullToRefresh.querySelector('span').textContent = 'Pull to refresh';
        
        // Show success feedback
        showRefreshSuccess();
    }, 1500);
}

// Show Refresh Success
function showRefreshSuccess() {
    const feedback = document.createElement('div');
    feedback.className = 'swipe-hint';
    feedback.innerHTML = '<i class="fas fa-check-circle"></i> <span>Applications refreshed!</span>';
    feedback.style.animation = 'slideInDown 0.3s ease, fadeOut 0.3s ease 1.5s forwards';
    feedback.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// View Details
function viewDetails(id) {
    const app = applications.find(a => a.id === id);
    if (app) {
        alert(`Application Details:\n\nCompany: ${app.company}\nRole: ${app.role}\nStatus: ${app.status}\nDate Applied: ${formatDate(app.dateApplied)}\nDescription: ${app.description}`);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
