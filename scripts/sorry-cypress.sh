#!/bin/bash
set -e

# Sign into Heroku Container Registry.
heroku container:login

# Pull services image
docker pull agoldis/sorry-cypress-director:latest
docker pull agoldis/sorry-cypress-api:latest
docker pull agoldis/sorry-cypress-dashboard:latest

# Tag service images as Heroku app image
docker tag agoldis/sorry-cypress-director:latest registry.heroku.com/motech-cypress-director/web
docker tag agoldis/sorry-cypress-api:latest registry.heroku.com/motech-cypress-api/web
docker tag agoldis/sorry-cypress-dashboard:latest registry.heroku.com/motech-cypress-dashboard/web

# Push the images to Heroku Container Registry
docker push registry.heroku.com/motech-cypress-director/web
docker push registry.heroku.com/motech-cypress-api/web
docker push registry.heroku.com/motech-cypress-dashboard/web

# Deploy the image
heroku container:release --app motech-cypress-director web
heroku container:release --app motech-cypress-api web
heroku container:release --app motech-cypress-dashboard web
