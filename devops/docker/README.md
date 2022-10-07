# Docker Development Environment

Docker is used by CircleCI and all testing environments as well as being available to run locally for developers.

## Building the docker image

Before pushing the docker image check that it builds locally:
```
docker build --no-cache -t beispar/proto:test .
```

Run `docker image ls` to check that the image was correctly built.

Once the image builds you can execute commands inside the container to confirm all the components run as expected.
```
docker exec -it beispar/proto:test /bin/bash
```

## Pushing a new docker image

To publish a new version of the Docker image run the push.sh script in the appropriate docker folder:
```
./proto/push.sh -t v1.0.0
```

You must have access to the central docker hub to push images to `beis-par` and login first with `docker login`.
