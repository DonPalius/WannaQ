mvn clean install -Pk8s

kubectl delete deployment apex-service-app
kubectl delete deployment league-service-app
kubectl delete deployment gateway-service-app

eval $(minikube -p minikube docker-env)

docker build -t league_service ./League/
docker build -t apex_service ./Apex/
docker build -t api_gateway ./ApiGateway/

kubectl apply -f k8s-scripts/services/

kubectl get all