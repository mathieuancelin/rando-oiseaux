nvm use 22
npm run build
rm -rf ./docs
mv ./build ./docs
git add --all
git commit -am 'build & deploy'
git push origin master