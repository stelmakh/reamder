module.exports = {
  npm: {
    styles: {
      'normalize.css': ['normalize.css']
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {
      joinTo: 'app.css'
    }
  },

  plugins: {
    babel: {presets: ['es2015', 'react']}
  }
};
