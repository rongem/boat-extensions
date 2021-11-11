npm update -g
cd frontend
ng update @angular/cli @angular/core @ngrx/store
npm update
npm audit fix
ng build
cd ../backend/
npm update
npm audit fix
tsc --declaration && npm run test
npm outdate
read -n 1
