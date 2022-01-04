sudo docker-compose stop

sudo docker volume rm csl_build
sudo docker volume rm csl_postgres-data
sudo docker volume rm csl_redis-data    
sudo rm -rf rm data

sudo docker-compose up --build --force-recreate nest next