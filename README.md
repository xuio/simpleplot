# Hopper Simpleplot

## Deps
* `nodejs`
* `yarn`

## Run
```
# install packages
yarn install

# build react dist
yarn run build

# edit config (config/default.json)

# run server and pipe data into it
node tools/gendata.js | node backend-src/server.js

# access frontend at localhost:3001
```

## Pipe format
Simple JSON array with length matching entries in config file. Allowed types are int, float.
e.g.:
```
[0.5, 0.25, -1]
```
