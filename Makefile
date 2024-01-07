.PHONY: install lint lint-ci run

install:
	yarn install --frozen-lockfile
	yarn run husky install

lint:
	yarn run format

lint-ci:
	yarn run lint

run:
	yarn run dev --host 0.0.0.0
