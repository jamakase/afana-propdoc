init:
	cp .env.example .env

up:
	docker compose up

run-detached:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

restart-service:
	docker-compose -f docker-compose.yaml up -d $(svc)

build-service:
	docker-compose -f docker-compose.yaml build $(svc)

rb:
	make build-service $(svc) && make restart-service $(svc)