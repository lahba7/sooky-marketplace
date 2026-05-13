// ============================================
// SOOKY - SYSTÈME D'AVIS COMPLET
// ============================================

// État du système d'avis
let reviewsState = {
  currentProductId: null,
  userRating: 0,
  uploadedPhotos: [],
  isSubmitting: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeReviewSystem();
});

function initializeReviewSystem() {
  // Récupérer l'ID du produit depuis l'URL ou les données de la page
  reviewsState.currentProductId = getProductIdFromPage();
  
  // Créer le formulaire d'avis si on est sur une page produit
  if (reviewsState.currentProductId && isUserLoggedIn()) {
    createReviewForm();
  }
  
  // Charger les avis existants
  loadExistingReviews();
}

function getProductIdFromPage() {
  // Essayer de récupérer l'ID depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId) return productId;
  
  // Sinon, utiliser un ID par défaut pour la démo
  return window.location.pathname.includes('produit.html') ? '1' : null;
}

function isUserLoggedIn() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.id || user.email;
}

function createReviewForm() {
  // Vérifier si l'utilisateur a déjà laissé un avis
  if (hasUserReviewed()) {
    showUserReview();
    return;
  }
  
  const reviewsSection = document.querySelector('.reviews-section');
  if (!reviewsSection) return;
  
  // Créer le formulaire d'avis
  const reviewFormHTML = `
    <div class="review-form-container" style="background: rgba(99, 102, 241, 0.05); border: 2px solid rgba(99, 102, 241, 0.2); border-radius: 20px; padding: 32px; margin-bottom: 40px;">
      <h3 style="font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 24px; color: var(--primary);">
        ⭐ Laisser un avis
      </h3>
      
      <!-- NOTATION -->
      <div class="rating-section" style="margin-bottom: 24px;">
        <label style="font-weight: 600; font-size: 16px; display: block; margin-bottom: 12px;">
          Votre note *
        </label>
        <div class="star-rating" style="display: flex; gap: 8px; margin-bottom: 8px;">
          ${[1,2,3,4,5].map(star => `
            <button type="button" class="star-btn" data-rating="${star}" 
                    style="background: none; border: none; font-size: 32px; cursor: pointer; color: #ddd; transition: all 0.2s;"
                    onmouseover="highlightStars(${star})" 
                    onmouseout="resetStars()" 
                    onclick="setRating(${star})">
              ★
            </button>
          `).join('')}
        </div>
        <div class="rating-text" style="font-size: 14px; color: var(--text-muted); font-style: italic;">
          Cliquez sur les étoiles pour noter
        </div>
      </div>
      
      <!-- COMMENTAIRE -->
      <div class="comment-section" style="margin-bottom: 24px;">
        <label for="review-comment" style="font-weight: 600; font-size: 16px; display: block; margin-bottom: 12px;">
          Votre commentaire *
        </label>
        <textarea id="review-comment" 
                  placeholder="Partagez votre expérience avec ce produit..."
                  style="width: 100%; min-height: 120px; padding: 16px; border: 2px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 15px; resize: vertical;"
                  maxlength="500"></textarea>
        <div style="text-align: right; font-size: 12px; color: var(--text-muted); margin-top: 4px;">
          <span id="comment-counter">0</span>/500 caractères
        </div>
      </div>
      
      <!-- PHOTOS -->
      <div class="photos-section" style="margin-bottom: 24px;">
        <label style="font-weight: 600; font-size: 16px; display: block; margin-bottom: 12px;">
          📸 Ajouter des photos (optionnel)
        </label>
        <div class="photo-upload-area" 
             style="border: 2px dashed var(--border); border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.3s;"
             onclick="triggerPhotoUpload()"
             ondragover="handleDragOver(event)"
             ondrop="handlePhotoDrop(event)">
          <input type="file" id="photo-upload" multiple accept="image/*" style="display: none;" onchange="handlePhotoSelect(event)">
          <div style="font-size: 48px; margin-bottom: 12px;">📷</div>
          <div style="font-weight: 600; margin-bottom: 8px;">Cliquez ou glissez vos photos ici</div>
          <div style="font-size: 14px; color: var(--text-muted);">JPG, PNG • Max 5 photos • 5MB par photo</div>
        </div>
        <div id="photo-preview" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;"></div>
      </div>
      
      <!-- BOUTONS -->
      <div style="display: flex; gap: 16px; justify-content: flex-end;">
        <button type="button" onclick="cancelReview()" 
                style="padding: 12px 24px; border: 2px solid var(--border); background: white; color: var(--text-primary); border-radius: 12px; font-weight: 600; cursor: pointer;">
          Annuler
        </button>
        <button type="button" onclick="submitReview()" id="submit-review-btn"
                style="padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s;"
                disabled>
          Publier l'avis
        </button>
      </div>
    </div>
  `;
  
  // Insérer le formulaire au début de la section avis
  reviewsSection.insertAdjacentHTML('afterbegin', reviewFormHTML);
  
  // Initialiser les événements
  initializeReviewFormEvents();
}

function initializeReviewFormEvents() {
  // Compteur de caractères pour le commentaire
  const commentTextarea = document.getElementById('review-comment');
  const commentCounter = document.getElementById('comment-counter');
  
  if (commentTextarea && commentCounter) {
    commentTextarea.addEventListener('input', function() {
      const length = this.value.length;
      commentCounter.textContent = length;
      
      // Changer la couleur si proche de la limite
      if (length > 450) {
        commentCounter.style.color = 'var(--secondary)';
      } else {
        commentCounter.style.color = 'var(--text-muted)';
      }
      
      // Vérifier si le formulaire peut être soumis
      validateReviewForm();
    });
  }
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#FFD700';
      star.style.transform = 'scale(1.1)';
    } else {
      star.style.color = '#ddd';
      star.style.transform = 'scale(1)';
    }
  });
}

function resetStars() {
  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star, index) => {
    if (index < reviewsState.userRating) {
      star.style.color = '#FFD700';
    } else {
      star.style.color = '#ddd';
    }
    star.style.transform = 'scale(1)';
  });
}

function setRating(rating) {
  reviewsState.userRating = rating;
  
  // Mettre à jour l'affichage des étoiles
  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#FFD700';
    } else {
      star.style.color = '#ddd';
    }
  });
  
  // Mettre à jour le texte de notation
  const ratingText = document.querySelector('.rating-text');
  const ratingLabels = {
    1: '⭐ Décevant',
    2: '⭐⭐ Moyen',
    3: '⭐⭐⭐ Bien',
    4: '⭐⭐⭐⭐ Très bien',
    5: '⭐⭐⭐⭐⭐ Excellent'
  };
  
  if (ratingText) {
    ratingText.textContent = ratingLabels[rating] || 'Cliquez sur les étoiles pour noter';
    ratingText.style.color = 'var(--primary)';
    ratingText.style.fontWeight = '600';
  }
  
  // Vérifier si le formulaire peut être soumis
  validateReviewForm();
}

function triggerPhotoUpload() {
  const photoInput = document.getElementById('photo-upload');
  if (photoInput) photoInput.click();
}

function handlePhotoSelect(event) {
  const files = Array.from(event.target.files);
  processPhotoFiles(files);
}

function handleDragOver(event) {
  event.preventDefault();
  const uploadArea = event.currentTarget;
  uploadArea.style.borderColor = 'var(--primary)';
  uploadArea.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
}

function handlePhotoDrop(event) {
  event.preventDefault();
  const uploadArea = event.currentTarget;
  uploadArea.style.borderColor = 'var(--border)';
  uploadArea.style.backgroundColor = 'transparent';
  
  const files = Array.from(event.dataTransfer.files);
  processPhotoFiles(files);
}

function processPhotoFiles(files) {
  // Filtrer les images uniquement
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  // Vérifier les limites
  if (reviewsState.uploadedPhotos.length + imageFiles.length > 5) {
    alert('Vous ne pouvez ajouter que 5 photos maximum');
    return;
  }
  
  imageFiles.forEach(file => {
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(`La photo "${file.name}" est trop volumineuse (max 5MB)`);
      return;
    }
    
    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoData = {
        file: file,
        url: e.target.result,
        id: Date.now() + Math.random()
      };
      
      reviewsState.uploadedPhotos.push(photoData);
      updatePhotoPreview();
    };
    reader.readAsDataURL(file);
  });
}

function updatePhotoPreview() {
  const previewContainer = document.getElementById('photo-preview');
  if (!previewContainer) return;
  
  previewContainer.innerHTML = reviewsState.uploadedPhotos.map(photo => `
    <div class="photo-preview-item" style="position: relative; width: 80px; height: 80px;">
      <img src="${photo.url}" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid var(--border);">
      <button onclick="removePhoto('${photo.id}')" 
              style="position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; background: var(--secondary); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">
        ×
      </button>
    </div>
  `).join('');
}

function removePhoto(photoId) {
  reviewsState.uploadedPhotos = reviewsState.uploadedPhotos.filter(photo => photo.id !== photoId);
  updatePhotoPreview();
}

function validateReviewForm() {
  const commentTextarea = document.getElementById('review-comment');
  const submitBtn = document.getElementById('submit-review-btn');
  
  if (!commentTextarea || !submitBtn) return;
  
  const hasRating = reviewsState.userRating > 0;
  const hasComment = commentTextarea.value.trim().length >= 10;
  
  const isValid = hasRating && hasComment;
  
  submitBtn.disabled = !isValid;
  submitBtn.style.opacity = isValid ? '1' : '0.5';
  submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

async function submitReview() {
  if (reviewsState.isSubmitting) return;
  
  const commentTextarea = document.getElementById('review-comment');
  if (!commentTextarea) return;
  
  const comment = commentTextarea.value.trim();
  
  // Validation finale
  if (reviewsState.userRating === 0 || comment.length < 10) {
    alert('Veuillez donner une note et écrire un commentaire d\'au moins 10 caractères');
    return;
  }
  
  reviewsState.isSubmitting = true;
  
  try {
    // Afficher le loader
    showSubmitLoader();
    
    // Préparer les données de l'avis
    const reviewData = {
      productId: reviewsState.currentProductId,
      userId: getCurrentUserId(),
      rating: reviewsState.userRating,
      comment: comment,
      photos: reviewsState.uploadedPhotos.map(photo => photo.url), // En production, uploader les vraies images
      createdAt: new Date().toISOString()
    };
    
    // Simuler l'envoi à l'API
    await simulateReviewSubmission(reviewData);
    
    // Sauvegarder localement
    saveReviewLocally(reviewData);
    
    // Afficher le succès
    showReviewSuccess();
    
    // Recharger les avis
    setTimeout(() => {
      location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('Erreur soumission avis:', error);
    alert('Erreur lors de l\'envoi de votre avis. Veuillez réessayer.');
  } finally {
    reviewsState.isSubmitting = false;
    hideSubmitLoader();
  }
}

function showSubmitLoader() {
  const submitBtn = document.getElementById('submit-review-btn');
  if (submitBtn) {
    submitBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Envoi en cours...
      </div>
    `;
  }
}

function hideSubmitLoader() {
  const submitBtn = document.getElementById('submit-review-btn');
  if (submitBtn) {
    submitBtn.innerHTML = 'Publier l\'avis';
  }
}

async function simulateReviewSubmission(reviewData) {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('Avis soumis:', reviewData);
  return { success: true };
}

function saveReviewLocally(reviewData) {
  const reviews = JSON.parse(localStorage.getItem('sooky_reviews') || '[]');
  reviews.unshift({
    ...reviewData,
    id: Date.now(),
    userName: getCurrentUserName(),
    userAvatar: getCurrentUserAvatar()
  });
  localStorage.setItem('sooky_reviews', JSON.stringify(reviews));
}

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.id || user.email || 'user_' + Date.now();
}

function getCurrentUserName() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.full_name || user.email?.split('@')[0] || 'Utilisateur';
}

function getCurrentUserAvatar() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getCurrentUserName())}&background=6366f1&color=fff`;
}

function hasUserReviewed() {
  const reviews = JSON.parse(localStorage.getItem('sooky_reviews') || '[]');
  const userId = getCurrentUserId();
  return reviews.some(review => 
    review.userId === userId && review.productId === reviewsState.currentProductId
  );
}

function showUserReview() {
  const reviews = JSON.parse(localStorage.getItem('sooky_reviews') || '[]');
  const userId = getCurrentUserId();
  const userReview = reviews.find(review => 
    review.userId === userId && review.productId === reviewsState.currentProductId
  );
  
  if (!userReview) return;
  
  const reviewsSection = document.querySelector('.reviews-section');
  if (!reviewsSection) return;
  
  const userReviewHTML = `
    <div class="user-review-display" style="background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 32px; margin-bottom: 40px;">
      <h3 style="font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 16px; color: var(--success);">
        ✅ Votre avis
      </h3>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="color: #FFD700; font-size: 20px;">
          ${'★'.repeat(userReview.rating)}${'☆'.repeat(5 - userReview.rating)}
        </div>
        <span style="font-weight: 600;">${userReview.rating}/5</span>
      </div>
      <p style="margin-bottom: 16px; line-height: 1.6;">${userReview.comment}</p>
      ${userReview.photos && userReview.photos.length > 0 ? `
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
          ${userReview.photos.map(photo => `
            <img src="${photo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--border);">
          `).join('')}
        </div>
      ` : ''}
      <div style="font-size: 14px; color: var(--text-muted);">
        Publié le ${new Date(userReview.createdAt).toLocaleDateString('fr-FR')}
      </div>
    </div>
  `;
  
  reviewsSection.insertAdjacentHTML('afterbegin', userReviewHTML);
}

function showReviewSuccess() {
  const formContainer = document.querySelector('.review-form-container');
  if (formContainer) {
    formContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
        <h3 style="font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 12px; color: var(--success);">
          Merci pour votre avis !
        </h3>
        <p style="color: var(--text-muted);">
          Votre avis a été publié avec succès. Il apparaîtra dans quelques instants.
        </p>
      </div>
    `;
  }
}

function cancelReview() {
  if (confirm('Êtes-vous sûr de vouloir annuler votre avis ?')) {
    const formContainer = document.querySelector('.review-form-container');
    if (formContainer) {
      formContainer.remove();
    }
  }
}

function loadExistingReviews() {
  // Cette fonction pourrait charger les avis depuis l'API
  // Pour l'instant, les avis sont statiques dans le HTML
  console.log('Chargement des avis existants...');
}

// Exposer les fonctions globalement
window.highlightStars = highlightStars;
window.resetStars = resetStars;
window.setRating = setRating;
window.triggerPhotoUpload = triggerPhotoUpload;
window.handleDragOver = handleDragOver;
window.handlePhotoDrop = handlePhotoDrop;
window.handlePhotoSelect = handlePhotoSelect;
window.removePhoto = removePhoto;
window.submitReview = submitReview;
window.cancelReview = cancelReview;