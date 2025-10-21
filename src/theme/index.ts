import plugin from 'tailwindcss/plugin'

// Primary theme - for global elements like header and footer
export const primaryTheme = {
  colors: {
    'primary': {
      'text': {
        'primary': '#ffffff',      // High contrast for headings
        'secondary': '#b3b3b3',    // Lower contrast for body text
        'accent': '#ffd700',       // Gold accent for special emphasis
      },
      'interactive': {
        'link': '#60a5fa',         // Default link state
        'hover': '#93c5fd',        // Hover state
        'visited': '#818cf8',      // Visited state
        'active': '#3b82f6',       // Active state
      },
      'bg': {
        'primary': '#000000',      // Main background
        'secondary': 'rgba(36 36 36 / 100%)',    // Slightly lighter background for contrast
        'densho': '#5c5823',       // Densho brand color
        'tertiary': 'rgba(52 52 52 / 100%)',     // Slightly darker for additional depth
      }
    },
    'museum': {
      'white': '#FFFFFF',
      'white-70': 'rgba(255, 255, 255, 0.7)',
      'white-50': 'rgba(255, 255, 255, 0.5)',
      'white-20': 'rgba(255, 255, 255, 0.2)',
      'black': '#000000',
      'black-70': 'rgba(0, 0, 0, 0.7)',
      'black-50': 'rgba(0, 0, 0, 0.5)',
      'black-20': 'rgba(0, 0, 0, 0.2)',
    },
    'vintage': {
      'paper': '#F5F4E9',      // Aged paper color - moderate warmth
      'ink': '#2F2F2F',        // Dark, slightly faded ink color
    }
  },
  fontFamily: {
    // Original fonts - keep these for existing components
    montserrat: ['Montserrat', 'sans-serif'],
    robotoCondensed: ['Roboto Condensed', 'sans-serif'],
    inter: ['Inter', 'system-ui', 'sans-serif'],
    'typewriter': ['Courier Prime', 'Courier', 'monospace'],
    
    // Historical document fonts
    'historical-heading': ['Franklin Gothic Condensed', 'Bureau Gothic', 'Arial Narrow', 'sans-serif'],
    'historical-body': ['Courier Prime', 'Courier', 'serif'],
  }
}

// Family Album theme - for the personal/family content sections
export const familyAlbumTheme = {
  colors: {
    'fa': {
      'text': {
        'primary': '#ffffff',      // High contrast for headings
        'secondary': '#b3b3b3',    // Lower contrast for body text
        'accent': '#ffd700',       // Gold accent for special emphasis
      },
      'interactive': {
        'link': '#60a5fa',         // Default link state
        'hover': '#93c5fd',        // Hover state
        'visited': '#818cf8',      // Visited state
        'active': '#3b82f6',       // Active state
      },
      'bg': {
        'primary': '#000000',      // Main background
        'secondary': '#1a1a1a',    // Slightly lighter background for contrast
      }
    }
  },
  fontFamily: {
    montserrat: ['Montserrat', 'sans-serif'],
    robotoCondensed: ['Roboto Condensed', 'sans-serif'],
    inter: ['Inter', 'system-ui', 'sans-serif'],
    'typewriter': ['Courier Prime', 'Courier', 'monospace'],
    
    // Historical document fonts
    'historical-heading': ['Franklin Gothic Condensed', 'Bureau Gothic', 'Arial Narrow', 'sans-serif'],
    'historical-body': ['Courier Prime', 'Courier', 'serif'],
  }
}

// Artwork theme - for the gallery and artwork sections
export const artworkTheme = {
  colors: {
    'art': {
      'text': {
        'primary': '#1a1a1a',      // Near black for high readability
        'secondary': '#4a4a4a',    // Softer gray for body text
        'accent': '#c41e3a',       // Deep red accent for emphasis
      },
      'interactive': {
        'link': '#0f766e',         // Teal for links
        'hover': '#0d9488',        // Lighter teal for hover
        'visited': '#1e40af',      // Deep blue for visited
        'active': '#0369a1',       // Blue for active state
      },
      'bg': {
        'primary': '#ffffff',      // Clean white for artwork focus
        'secondary': '#f3f4f6',    // Light gray for contrast sections
        'tertiary': '#e5e7eb',     // Slightly darker for additional depth
      }
    }
  },
  fontFamily: {
    // More formal, gallery-appropriate fonts
    display: ['Playfair Display', 'serif'],
    body: ['Source Sans Pro', 'sans-serif'],
    caption: ['Lato', 'sans-serif'],
  }
}

// Family Album Plugin
export const familyAlbumPlugin = plugin(
  function({ addComponents, theme }) {
    addComponents({
      '.family-album': {
        backgroundColor: theme('colors.fa.bg.primary'),
        color: theme('colors.fa.text.secondary'),
        fontFamily: theme('fontFamily.montserrat'),
        
        'h1, h2, h3, h4, h5, h6': {
          color: theme('colors.fa.text.primary'),
          fontFamily: theme('fontFamily.robotoCondensed'),
        },
        
        'a': {
          color: theme('colors.fa.interactive.link'),
          '&:hover': {
            color: theme('colors.fa.interactive.hover'),
          },
          '&:visited': {
            color: theme('colors.fa.interactive.visited'),
          },
        },
      }
    })
  }
)

// Artwork Gallery Plugin
export const artworkGalleryPlugin = plugin(
  function({ addComponents, theme }) {
    addComponents({
      '.artwork-gallery': {
        backgroundColor: theme('colors.art.bg.primary'),
        color: theme('colors.art.text.secondary'),
        fontFamily: theme('fontFamily.body'),
        
        'h1, h2, h3, h4, h5, h6': {
          color: theme('colors.art.text.primary'),
          fontFamily: theme('fontFamily.display'),
        },
        
        'a': {
          color: theme('colors.art.interactive.link'),
          '&:hover': {
            color: theme('colors.art.interactive.hover'),
          },
          '&:visited': {
            color: theme('colors.art.interactive.visited'),
          },
        },
      }
    })
  }
)
