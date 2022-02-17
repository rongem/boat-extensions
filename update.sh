npm update -g
cd frontend
ng update @angular/cli @angular/core @ngrx/store
npm update
npm audit fix
grunt bump
ng build
cd ../backend/
npm update
npm audit fix
grunt bump
tsc --declaration && npm run test
npm outdate
read -n 1
