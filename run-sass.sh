#!/bin/bash -x

# Preprocess SASS to CSS

sass ./src/materialize-src/sass/ghpages-materialize.scss > ./node_modules/materialize-css/dist/css/materialize2.css
