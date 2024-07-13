// .mocharc.js
module.exports = {
    require: ['@babel/register'], // Use Babel for transpiling
    spec: 'src/tests/**/*.test.js'    // Adjust the pattern to match your test files
};
