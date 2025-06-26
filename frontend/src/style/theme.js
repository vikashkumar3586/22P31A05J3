// Global styles and theme configurations
export const globalStyles = {
  body: {
    margin: 0,
    fontFamily: 'Roboto, Arial, sans-serif',
    backgroundColor: '#f5f5f5'
  }
};

// Additional Material-UI theme customizations
export const themeExtensions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
};
