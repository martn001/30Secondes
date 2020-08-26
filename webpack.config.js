/* Webpack command for creating the dist: npx webpack */

const path = require('path');

module.exports = {
    entry: ['./javascript/script.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
