#!/bin/bash

# Source/load nvm
[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh;

cd client;
nvm use;
yarn;

pm2 restart 'transform-narratives'; 
