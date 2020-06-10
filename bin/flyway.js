'use strict';

const program = require('commander');
const pkg = require('../package.json');
const path = require('path');
const spawn = require('child_process').spawn;
const download = require('../lib/download');

process.title = 'flyway';
program
    .version(pkg.version)
    .option('-c, --configfile <file>', 'Um jscript ou arquivo JSON contendo as configurações.')
    .option('-h, --help', 'Mostrar os comandos de ajuda')
    .option('-V, --version', 'Mostra o número da versão de migração do banco de dados configurado.')
    .on('--help', function() {
        console.log(' Para verificar as opções de configuração do Flyway\'s: https://flywaydb.org/documentation/commandline/');
    });

makeCommand('migrate', 'Migra o schema para a última versão.O Flyway irá criar a tabela de metadata automaticamente se ela não existir.');
makeCommand('clean', 'Apaga todos objetos (tables, views, procedures, triggers, ...) nos schemas configurados. Os schemas são limpos na ordem especificadas pelas propriedades dos schemas.');
makeCommand('validate', `Valida migrações aplicadas com as encontradas (no sistema de arquivos ou classpath) para detectar alterações acidentais possibilitando que os schemas sejam criados exatamente como desejado.

            A validação falhará se
             - diferenças nos nomes das migrações, tipos or checksums encontrados
             - versões aplicadas que não podem ser resolvidas localmente
             - versões resolvidas que não foram aplicadas ainda`);
makeCommand('baseline', 'Baselines de um database existente, excluindo todas migrações executadas e incluidas em baselineVersion.');
makeCommand('repair', `Repara a tabela de metadata do Flyway. Irá executar as seguintes ações:

             -Remover qualquer migração falhada no banco de dados sem transação de DDL
             (Objetos do usuário deixados para trás dever ser limpos manualmente)
             - Corrigir checksums incorretos`);

program.parse(process.argv);

function makeCommand(name, desc) {
    program
        .command(name)
        .description(desc)
        .action(exeCommand);
}

function configFlywayArgs(config) {
    const flywayArgs = config.flywayArgs || {};
    const flywayArgsKeys = Object.keys(flywayArgs);

    return flywayArgsKeys.map(function(key) {
        return `-${key}=${flywayArgs[key]}`;
    });
}

function exeCommand(cmd) {
    if(!program.configfile) {
        throw new Error('Arquivo de configurações é requerido, ver https://github.com/dev-senior-com-br/multischemase/blob/master/README.md');
    }

    var config = require(path.resolve(program.configfile));

    if (typeof config === 'function') {
        var service = 'service';
        var tenant = 'teste';
        config = config(service, tenant);
    }

    download.ensureArtifacts(config, function(err, flywayBin) {
        const workingDir = process.cwd();

        if(err) {
            throw new Error(err);
        }

        const args = configFlywayArgs(config)
            .concat([cmd._name]);

        const child = spawn(flywayBin, args, {
            env: Object.assign({}, process.env, config.env),
            cwd: workingDir,
            stdio: 'inherit',
            windowsVerbatimArguments: true // Super Weird, https://github.com/nodejs/node/issues/5060
        });

        child.on('close', code => {
            process.exit(code);
        });
    });
}
