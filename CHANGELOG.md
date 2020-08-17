# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2020-08-17

### Fixed

-   Corrigido problemas de concorrencia entre schemas quando é feito muitas chamadas de migração ao mesmo tempo.

## [1.1.0] - 2020-08-16

### Changed

### Fixed

### Removed

### Added

-   Configurado CI/CD utilizando Github Actions.
-   Migrado a solução de Flyway para Knex, deixando a lib sem dependencia de `Java` e `Maven`.

[Unreleased]: https://github.com/dev-senior-com-br/multischemase/compare/v1.2.0...HEAD

[1.2.0]: https://github.com/dev-senior-com-br/multischemase/compare/v1.1.0...1.2.0

[1.1.0]: https://github.com/dev-senior-com-br/multischemase/releases/tag/v1.1.0
