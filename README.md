# @seniorsistemas/multischemase

`Multischemase` é uma lib em node de migração de base multi schemas.
Ela utiliza o `Knex` para realizar migrações de base com DDLs em formato sql.

## Instalação

```shell
npm i @seniorsistemas/multischemase --save
```

## Utilização

### Configuração

É necessário criar um arquivo de configuração do `Multischemase`. Por default a lib vai procurar pelo arquivo `multischemase.json` na raiz do projeto, porém é possível passar um JSON no formato [Config Json](#Config_json)

#### Config file

Json de exemplo utilizando configurações para o `postgres` e arquivos `.sql`, o que está comentado é default:

```jsonc
{
  "connection": {                                               /* Connection defaults depends on database client */
    // "host": "localhost",                                     /* Connection host */
    // "port": 5432,                                            /* Connection port */
    // "database": "postgres",                                  /* Connection database */
    "user": "postgres",                                         /* Connection user */
    "password": "postgres"                                      /* Connection password */
  },
  // "directory": "./migrations",                               /* Migration directory to get migration files */
  // "fileRegex": "^\\d+[\\w-]+\\.sql$",                        /* Regex to match sql files in migration directory */
  // "migrationType": "sql",                                    /* Migration type.*/
  // "client": "pg"                                             /* Database client type */
}
```

#### Config json

```javascript
const multischemaseJson = {
  "connection": {
    "host": "localhost",
    "port": 5432,
    "database": "postgres",
    "user": "postgres",
    "password": "postgres"
  },
  "directory": "./migrations",
  "fileRegex": /^\\d+[\\w-]+\\.sql$/,
  "migrationType": "sql",                                    /* Migration type.*/
  "client": "pg",
  "log": {
    warn: (message) => console.log(message),
    debug: (message) => console.log(message),
    error: (message) => console.log(message)
  }
}
```



### Migrações

O `Multischemase` vai procurar arquivos de migração no diretório que você informar, porém por default ele vai procurar na pasta `migrations` na raiz do projeto. Esses arquivos de migração devem atender ao regex informado no arquivo `multischemase.json`, o regex default é: `^\d+[\w-]+\.sql$`. [Teste o regex](https://regex101.com/r/IAuURp/2/).

### Importando

ES6 Modules:

```javascript
import { Multischemase } from '@seniorsistemas/multischemase';
```

CommonJS:

```javascript
const { Multischemase } = require('@seniorsistemas/multischemase');
```

### Executando

```javascript
const multischemase = new Multischemase();
multischemase.setContext('schemaprefix', 'schemasuffix');
multischemase.migrate().then(() => console.log('migration finalized')).catch(err => console.error(err));
```

### Trabalhando com promises

Todos os metodos de migração de base do `Multischemase` retornam promises. Caso tenha algumas dificuldades ou nunca trabalhou com promises, aqui vai alguns links para auxiliar: [Promises](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Asynchronous/Promises) e [async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

## Documentação

### Multischemase

Classe que controla e possui as funções de migrações de base multi schema.

#### Construtor

É possível passar o caminho de um arquivo de configuração (default é `multischemase.json`) ou um objeto de configuração do tipo [Config](#config_file).

```javascript
new Multischemase('/var/home/multischemase.json');
new Multischemase({"connection": {"user": "postgres","password": "postgres"}});
```

#### Mecanismo de lock

Após executar uma das funções documentadas abaixo, a classe `Multischemase` checa se uma migration está sendo executada e caso estiver, ela bloqueia a ação atual lançando um erro.

#### setContext

Metodo que define em qual [Contexto](#contexto) o `Multischemase` deve realizar as próximas migrações ou consultas de migração. Por default o [Contexto](#contexto) sempre vai ser atribuído em `lowerCase`.

#### Migrate

Realiza as migrações restantes com base no [Contexto](#contexto), na configuração de conexão da base e dos arquivos de migração. O `Knex` mantém no [Contexto](#contexto) as migrações já realizadas, assim ele consegue saber quais migrações precisam ser executadas.

#### Clean

Realiza um delete do [Contexto](#contexto), removendo todas tabelas, objetos, funções e etc.

#### Current

Mostra o nome da ultima migração executada no [Contexto](#contexto).

#### List

Lista todas as migrações executadas e pendentes no [Contexto](#contexto).

### Contexto

Os contextos são como o `Multischemase` trata o multi schema. Cada schema é um contexto diferente para o `Multischemase`, sempre que é modificado o contexto através da função `setContext`, é criado um novo objeto do `Knex` com uma nova conexão apontando para este schema. Você pode sempre trocar o contexto de uma instancia do [Multischemase](#multischemase), desde que ele não esteja com nenhuma execução em andamento.

Todo contexto passado para o multischemase, será tratado como `lowerCase`.

OBS: Não recomendamos que você tenha várias instancias de [Multischemase](#multischemase) apontando para vários contextos de uma unica base. Se você for trabalhar com uma única base, recomendamos utilizar uma unica instancia de [Multischemase](#multischemase).

## Exemplos

Dentro da pasta `examples` possui alguns exemplos de uso. Para testar basta ter um `postgres` local com user e pass como `postgres`. Para rodar basta executar `npm start`. É possível mudar a configuração default dos exemplos alterando o arquivo `examples/multischemase.json`
