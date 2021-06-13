.PHONY: install lint lint-ci run

install:
	yarn install --frozen-lockfile

lint:
	yarn run format

lint-ci:
	yarn run lint

run:
	yarn run dev
