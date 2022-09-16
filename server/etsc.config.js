const copyStaticFiles = require('esbuild-copy-static-files')

module.exports = {
	// Supports all esbuild.build options
	esbuild: {
	  plugins: [copyStaticFiles({
		src: "src/config",
		dest: "dist/config",
	  })]
	},
  };