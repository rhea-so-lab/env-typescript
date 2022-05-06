cp package.json dist
cp README.md dist
cp LICENSE dist
cp CODE_OF_CONDUCT.md dist
cp .npmrc dist
cd dist
npm publish
cd ..
