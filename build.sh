git checkout gh-pages
rm -rf img *.css *.js *.html build.sh
git checkout master src build.sh webpack.config.js package.json
git reset HEAD
npm run build-prod
mv -fv docs/* ./
rm -rf src docs build.sh webpack.config.js package.json
git add -A
git commit -m "Generated gh-pages for `git log master -1 --pretty=short --abbrev-commit`" && git push origin gh-pages ; git checkout master
