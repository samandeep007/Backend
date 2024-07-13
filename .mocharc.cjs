// .mocharc.js
module.exports = {
    require: ['@babel/register', './src/test/setupTests.js'], // Use Babel for transpiling and setup script
    spec: './src/test/**/*.test.js',                            // Pattern to match your test files
    reporter: 'spec'
};
