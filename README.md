Multischemase
================

Multischemase é uma ferramenta de criação de banco de dados multi schemas e migração independente de estrutura para o Node.

## Depêndencias
Esse projeto tem depêndencia de JAVA +1.8 e com variável de ambiente configurada JAVA_HOME.

## Suporte
Esse projeto poderá ser executado nos seguintes sistemas operacionais que estão testados: Windows 10, Linux e Mac OS X

## Instalar
Na raíz do projeto executar a linha de comando:
```
npm install
```

### Executar por linha de comando
Para executar a migração por linha de comando, digite:
```
node .\bin\flyway.js -c conf/config.js migrate
```

#### Funcionalidades
|Parâmetro|Descrição|
|-----|----|--------|-----------|
|migrate|Migra o schema para a última versão.O Flyway irá criar a tabela de metadata automaticamente se ela não existir.|
|clean|Apaga todos objetos (tables, views, procedures, triggers, ...) nos schemas configurados. Os schemas são limpos na ordem especificadas pelas propriedades dos schemas.|
|info|Imprime os detalhes e informações de status sobre todas as migrações.|
|baseline|Baselines de um database existente, excluindo todas migrações executadas e incluidas em baselineVersion.|
|repair|Repara a tabela de metadata do Flyway. Irá executar as seguintes ações:<br> - Remover qualquer migração falhada no banco de dados sem transação de DDL(Objetos do usuário deixados para trás dever ser limpos manualmente)<br> - Corrigir checksums incorretos|
|validate|Valida migrações aplicadas com as encontradas (no sistema de arquivos ou classpath) para detectar alterações acidentais possibilitando que os schemas sejam criados exatamente como desejado.A validação falhará se:<br>- diferenças nos nomes das migrações, tipos or checksums encontrados<br>- versões aplicadas que não podem ser resolvidas localmente<br>- versões resolvidas que não foram aplicadas ainda|
			 
## Configurações
As configurações poderão ser realizas por arquivo JS ou JSON. Na pasta `conf` possui um exemplo em Postgres local de nome `config.js`.
A função pede dois parâmetros:<br>
O nome do serviço pela variável `service`;<br>
O nome do tenant pela variável `tenant`.
Para configurar a conexão com o seu banco, altere as propriedades conforme abaixo:
```
        flywayArgs: {
            url: '<JDBC_BANCO_DADOS>' //ex:jdbc:postgresql://localhost/postgres,
            ..,
            user: '<NOME_DO_USUARIO_BANCO_DADOS>' //postgres,
            password: '<SENHA_DO_USUARIO_BANCO_DADOS>' //postgres,
           ...
        }
```
Os arquivos de migração devem ficar localizados na pasta `db/sql` e a extensão deles deverá ser `.pgsql`.
Vide exemplo de arquivo em  `V0001__StartingOut.pgsql` que criará uma função de nome _next_id no schema public do seu banco Postgres. 

## Compilar o projeto

O comando abaixo permite a transpilação/compilação do projeto:
```
npm run build
```

## Testar o projeto

Para executar os testes do projeto:
```
npm t
```