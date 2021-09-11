docker build -f Dockerfile.backend . -t rongem/boat3-extensions:backend --no-cache
docker build -f Dockerfile.ep-frontend . -t rongem/boat3-extensions:frontend-enterprise-proxy-v2 --no-cache
docker build -f Dockerfile.frontend . -t rongem/boat3-extensions:latest
docker push rongem/boat3-extensions:backend
docker push rongem/boat3-extensions:frontend-enterprise-proxy-v2
docker push rongem/boat3-extensions:latest
