.PHONY: build-docker run-docker

IMAGE_NAME ?= game-of-life
PLATFORMS ?= linux/amd64,linux/arm64
REGISTRY ?= jimtang2

build-docker:
	docker build -t $(IMAGE_NAME):latest --platform $(PLATFORMS) .

build-push-docker:
	docker buildx build -t $(REGISTRY)/$(IMAGE_NAME):latest --platform $(PLATFORMS) --push .

CONTAINER_NAME ?= game-of-life
HOST_PORT ?= 8888
CONTAINER_PORT ?= 8080
GOL_GAME_WIDTH := 100
GOL_GAME_HEIGHT := 50
GOL_GAME_INTERVAL := 100ms

run-docker:
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-p $(HOST_PORT):$(CONTAINER_PORT) \
		-e GOL_GAME_WIDTH=$(GOL_GAME_WIDTH) \
		-e GOL_GAME_HEIGHT=$(GOL_GAME_HEIGHT) \
		-e GOL_GAME_INTERVAL=$(GOL_GAME_INTERVAL) \
		$(IMAGE_NAME)