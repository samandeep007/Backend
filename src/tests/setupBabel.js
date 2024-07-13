import '@babel/register';  
import '@babel/polyfill';  


require('@babel/register')({
  ignore: [/(node_module)/],
  extensions: ['.js'],
});
