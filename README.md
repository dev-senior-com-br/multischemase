# @seniorsistemas/multischemase

`Multischemase` é uma lib em node de migração de base multi schemas.
Ela utiliza o `Knex` para realizar migrações de base com DDLs em formato sql.

## Instalação

```shell
$ npm i @seniorsistemas/multischemase --save
```

Também é necessário instalar a lib do banco de dados que você vai utilizar no multischemase:
```shell
$ npm install pg
$ npm install sqlite3 # not tested
$ npm install mysql # not tested
$ npm install mysql2 # not tested
$ npm install oracledb # not tested
$ npm install mssql # not tested
```

## Utilização

### Configuração

Para configurar há várias maneiras, com json, passando caminho de arquivo e passando um cliend do `Knex`. Vamos listar abaixo as formas de configuração:

#### Config file

Arquivo de configuração em formato de `json`. O caminho deste arquivo pode ser passado na função [Custom](custom).

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
  // "client": "pg"                                             /* Database client type */
}
```

#### Config json

Json de configuração. Este `json` pode ser passado na função [Custom](custom).

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
  "client": "pg",
  "log": {
    warn: (message) => console.log(message),
    debug: (message) => console.log(message),
    error: (message) => console.log(message)
  }
}
```

#### Knexfile

Arquivo de configuração default do `Knex`. Exemplo no próprio site da documentação do [Knex](http://knexjs.org/#Installation-client). O caminho do `knexfile.js` pode ser passado por parametro na função [Knex](knex).

#### Knex json

Json de configuração do `Knex`. Segue a mesma estrutura do `knexfile.js`, porém já transformado em `json`. Pode ser passado por parametro na função [Knex](knex).

#### Knex client

Também é possivel passar um client do `Knex` para o multischemase, para que seja criado um novo client do `Knex` utilizando a configuração inicial do `Knex` informado por parametro. Deve se usar a função [Knex](knex).

### Migrações

O `Multischemase` vai procurar arquivos de migração no diretório que você informar, porém por default ele vai procurar na pasta `migrations` na raiz do projeto. Esses arquivos de migração devem atender ao regex informado no arquivo `multischemase.json`, o regex default é: `^\d+[\w-]+\.sql$`. No caso de passar um arquivo no formato `knexfile.js`, o regex será ignorado.  [Teste o regex](https://regex101.com/r/IAuURp/2/).

### Importando

ES6 Modules:

```javascript
import Multischemase from '@seniorsistemas/multischemase';
```

CommonJS:

```javascript
const Multischemase = require('@seniorsistemas/multischemase');
```

### Executando

```javascript
const multischemase = Multischemase.Custom();
multischemase.setContext('schemaprefix', 'schemasuffix');
multischemase.migrate().then(() => console.log('migration finalized')).catch(err => console.error(err)).finally(() => multischemase.destroy());
```

### Trabalhando com promises

Todos os metodos de migração de base do `Multischemase` retornam promises. Caso tenha algumas dificuldades ou nunca trabalhou com promises, aqui vai alguns links para auxiliar: [Promises](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Asynchronous/Promises) e [async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

## Documentação

### Custom

Metodo assincrono que gera uma instancia de [Multischemase](multischemase). Pode receber por parâmetro um [json](config_json) ou uma string com o caminho para o [arquivo de configuração](config_file). Se não for informado nenhum parâmetro a função irá procurar pelo arquivo `multischemase.json`.

Exemplos:

```javascript
const Multischemase = require('@seniorsistemas/multischemase');

//Example 1
Multischemase.Custom('examples/multischemase.json').then(multischemase => {
  multischemase.setContext('servicename1', 'tenantname1');
  return multischemase.migrate();
}).finally(multischemase.destroy);


//Example 2
const config = {
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres'
  },
  client: 'pg'
};
Multischemase.Custom(config).then(multischemase => {
  multischemase.setContext('servicename2', 'tenantname2');
  return multischemase.migrate();
}).finally(multischemase.destroy);

//Example 3
Multischemase.Custom().then(multischemase => {
  multischemase.setContext('servicename1', 'tenantname1');
  return multischemase.migrate();
}).finally(multischemase.destroy);
```

### Knex

Metodo assincrono que gera uma instancia de [Multischemase](multischemase). Pode receber por parâmetro uma string contendo o caminho do [knexfile.js](knexfile), um [json](knex_json) ou um [client do knex](knex_client). Se não informado nenhum parâmetro a função irá procurar pelo arquivo `knexfile.js`. Em casos em que é informado o caminho do `knexfile`, também pode se informar a `env` a ser utilizada, por default é utilizado o padrão: `process.env.NODE_ENV || 'development'`.

Exemplos:

```javascript
const Multischemase = require('@seniorsistemas/multischemase');
const Knex = require('knex');

//Example 1
Multischemase.Knex('examples/knexfile.js', 'staging').then(multischemase => {
  multischemase.setContext('servicename1', 'tenantname1');
  return multischemase.migrate();
}).finally(multischemase.destroy);


//Example 2
const config = {
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres'
  },
  client: 'pg',
  migrations: {
    directory: 'examples/migrations'
  }
};
Multischemase.Knex(config).then(multischemase => {
  multischemase.setContext('servicename2', 'tenantname2');
  return multischemase.migrate();
}).finally(multischemase.destroy);

//Example 3

const knex = KnexLib();
Multischemase.Knex(knex).then(multischemase => {
  multischemase.setContext('servicename2', 'tenantname2');
  return multischemase.migrate();
}).finally(multischemase.destroy);

//Example 4

Multischemase.Knex().then(multischemase => {
  multischemase.setContext('servicename2', 'tenantname2');
  return multischemase.migrate();
}).finally(multischemase.destroy);
```

### Multischemase

Classe que controla e possui as funções de migrações de base multi schema.

#### Mecanismo de lock

Após executar uma das funções documentadas abaixo, a classe `Multischemase` checa se uma migration está sendo executada e caso estiver, ela bloqueia a ação atual lançando um erro.

#### setContext

Metodo que define em qual [Contexto](#contexto) o `Multischemase` deve realizar as próximas migrações ou consultas de migração. Por default o [Contexto](#contexto) sempre vai ser atribuído em `lowerCase`.

#### Migrate

Realiza as migrações restantes com base no [Contexto](#contexto), na configuração de conexão da base e dos arquivos de migração. O `Knex` mantém no [Contexto](#contexto) as migrações já realizadas, assim ele consegue saber quais migrações precisam ser executadas.

#### Clean

Realiza o delete do [Contexto](#contexto), removendo todas as tabelas, objetos, funções e etc.

#### Current

Mostra o nome da ultima migração executada no [Contexto](#contexto).

#### List

Lista todas as migrações executadas e pendentes no [Contexto](#contexto).

#### Destroy

Após executar o multischemase e após ter a certeza de que nao sera mais executado nenhuma função do mesmo, deve se destruir o objeto. Chamando a função `.destroy()`

#### getClient

Método que retorna a instancia do `Knex` com o schema atribuído.

### Contexto

Os contextos são como o `Multischemase` trata o multi schema. Cada schema é um contexto diferente para o `Multischemase`, sempre que é modificado o contexto através da função `setContext`, é criado um novo objeto do `Knex` com uma nova conexão apontando para este schema. Você pode sempre trocar o contexto de uma instancia do [Multischemase](#multischemase), desde que ele não esteja com nenhuma execução em andamento.

Todo contexto passado para o multischemase, será tratado como `lowerCase`.

OBS: Não recomendamos que você tenha várias instancias de [Multischemase](#multischemase) apontando para vários contextos de uma unica base. Se você for trabalhar com uma única base, recomendamos utilizar uma unica instancia de [Multischemase](#multischemase).

## Exemplos

Dentro da pasta `examples` possui alguns exemplos de uso. Para testar basta ter um `postgres` local com user e pass como `postgres`. Para rodar basta executar `npm start`. É possível mudar a configuração default dos exemplos alterando o arquivo `examples/multischemase.json`
