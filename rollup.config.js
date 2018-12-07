import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';

const gglobals = {
    'dashjs': 'dashjs'
};

const gplugins = [
    resolve({
        preferBuiltins: true
        , browser: true
    })
    , commonjs()
    , builtins()
    , globals()
    , babel({
        exclude: 'node_modules/**'
        , babelrc: false
        , presets: [['@babel/env', { modules: false }]]
        , plugins: ['@babel/plugin-transform-object-assign']
        //, externalHelpers: true
    })
];

export default [
    {
        external: ['dashjs']
        , input: 'src/main.js'
        , output: 
      
        {
            file: 'lib/bundle.js'
            , sourcemap: true
            , format: 'iife'
            , name: 'mgPlay'
            , globals: gglobals
        }
        
  
  
        , plugins: gplugins
    }
    , {
        external: ['dashjs']
        , input: 'src/play.js'
        , output: 
    {
        file: 'lib/index.js'
        , sourcemap: true
        , format: 'cjs'
        , globals: gglobals
    }
    


        , plugins: gplugins
    }
,]
;
