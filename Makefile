.PHONY: install lint lint-ci

install:
	yarn install --frozen-lockfile

lint:
	yarn run format

lint-ci:
	yarn run lint
