if [ "$1" == "-g" ]; then
	echo Updating global libraries
	npm update -g
fi
cd frontend
echo Updating @angular
ng update @angular/cli @angular/core @ngrx/store
echo Updating other libraries
npm update
npm audit fix
grunt bump
ng build
cd ../backend/
echo Updating backend
npm update
npm audit fix
grunt bump
tsc --declaration && npm run test
npm outdate
read -n 1
cd ..
./docker-create.sh

