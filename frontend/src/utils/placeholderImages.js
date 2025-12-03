// Local placeholder images
export const placeholderImages = {
  artists: {
    1: 'https://ui-avatars.com/api/?name=Nova+Rhythm&background=8A2BE2&color=fff&size=400',
    2: 'https://ui-avatars.com/api/?name=Luna+Waves&background=00D4FF&color=fff&size=400',
    3: 'https://ui-avatars.com/api/?name=Echo+Theory&background=FF4D4D&color=fff&size=400',
  },
  products: {
    default: 'https://ui-avatars.com/api/?name=Product&background=16213E&color=fff&size=800',
    album: 'https://ui-avatars.com/api/?name=Album&background=8A2BE2&color=fff&size=800',
    merch: 'https://ui-avatars.com/api/?name=Merch&background=00D4FF&color=fff&size=800',
    ticket: 'https://ui-avatars.com/api/?name=Ticket&background=00CC88&color=fff&size=800',
  },
  backgrounds: {
    hero: '/images/backgrounds/hero-bg.jpg',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
};

// Get a safe image URL with fallback
export const getSafeImageUrl = (url, type = 'product') => {
  if (!url) {
    // Return appropriate placeholder based on type
    if (type === 'artist') return placeholderImages.artists[1];
    if (type === 'album') return placeholderImages.products.album;
    if (type === 'merch') return placeholderImages.products.merch;
    if (type === 'ticket') return placeholderImages.products.ticket;
    return placeholderImages.products.default;
  }
  
  // Check if URL is blocked by ORB
  if (url.includes('unsplash.com') || url.includes('random')) {
    console.warn('Using fallback image for:', url);
    return placeholderImages.products.default;
  }
  
  return url;
};

// Generate gradient background
export const getGradientBackground = (colors = ['#8A2BE2', '#00D4FF']) => {
  return `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
};

// Avatar generator for user profiles
export const generateAvatar = (name, size = 400) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const colors = ['8A2BE2', '00D4FF', 'FF4D4D', '00CC88', 'FFAA00'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=${size}`;
};