init:
	cp .env.example .env

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build