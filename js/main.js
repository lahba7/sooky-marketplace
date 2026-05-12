// Favorite button toggle
document.querySelectorAll('.favorite-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const svg = this.querySelector('svg path');
    const currentFill = svg.getAttribute('fill');
    
    if (currentFill === 'none' || !currentFill) {
      svg.setAttribute('fill', '#C8553D');
      this.style.background = 'rgba(200, 85, 61, 0.1)';
    } else {
      svg.setAttribute('fill', 'none');
      this.style.background = 'white';
    }
  });
});

// Search functionality (basic)
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value;
      if (query.trim()) {
        window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add to cart animation (basic)
document.querySelectorAll('.btn-primary').forEach(btn => {
  if (btn.textContent.includes('Ajouter au panier')) {
    btn.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = '✓ Ajouté au panier';
      this.style.background = '#1E5F66';
      
      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
      }, 2000);
    });
  }
});
