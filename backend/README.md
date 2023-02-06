# Run App

## Intellij
Aggiungere nelle variabili d'ambiente(Edit configuration):

### League
- RIOT_API_KEY

### Apex
- APEX_API_KEY

---
## Docker

---
## Kubernetes

### Build Maven
- run
  - mvn clean install -P k8s
### Set up Secret
- create file wannaq-secret.yml in /k8s-scripts/config
  - metadata: wannaq-secret
  - type: opaque
  - data:
    - postgres-username: encripted username
    - postgres-password: encripted password
    - apex-api-key: encripted api-key
    - league-api-key: encripted api-key
  - encription 
    - echo {string} | base64
### Set up Minikube
- minikube start
- non eseguire se le immagini sono pushate su dockerhub (atm non lo sono)
  - eval $(minikube -p minikube docker-env)
  - docker build -t league_service ./League/
  - docker build -t apex_service ./Apex/
  - docker build -t api_gateway ./ApiGateway/
- minikube addons list
- controllare se metallb è attivo
    -   se no
    -   minikube addons enable metallb
    -   minikube ip
    -   kubectl get pods -n metallb-system
    -   minikube addons configure metallb
        -   inserisci ip in entrambi i prompt
- minikube addons enable ingress
- kubectl apply -f k8s-scripts/config/
- kubectl apply -f k8s-scripts/persistance/
- kubectl apply -f k8s-scripts/postgres/
- kubectl apply -f k8s-scripts/services/
- kubectl apply -f k8s-scripts/ingress/
- echo "$(minikube ip) wannaq.me" | sudo tee -a /etc/hosts
  - ricordarsi di cambiare ip quando si starta un nuovo minikube
##
### Minikube controls
- kubectl delete deployment|service|pod|service {deployment|service|pod|service name}
- kubectl logs {pod}
- minikube delete --all --purge
---
# TODO
- Aggiungere test Api Gateway
- Fixare Chiamate Api frontend