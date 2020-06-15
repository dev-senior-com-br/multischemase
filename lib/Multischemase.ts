import pkg = require('../package.json');
import path = require('path');
import download = require('./download');
import CommandsEnum = require('./CommandsEnum');

const { spawn } = require("child_process");
let { program } = require('commander');

export = class Multischemase {
    private _service: string;
    private _tenant: string;

    constructor(service: string, tenant: string) {
        this._service = service;
        this._tenant = tenant;
        this.makeCommand(CommandsEnum.MIGRATE, 'Migra o schema para a última versão.O Flyway irá criar a tabela de metadata automaticamente se ela não existir.');
        this.makeCommand(CommandsEnum.CLEAN, 'Apaga todos objetos (tables, views, procedures, triggers, ...) nos schemas configurados. Os schemas são limpos na ordem especificadas pelas propriedades dos schemas.');
        this.makeCommand(CommandsEnum.VALIDATE, `Valida migrações aplicadas com as encontradas (no sistema de arquivos ou classpath) para detectar alterações acidentais possibilitando que os schemas sejam criados exatamente como desejado.

            A validação falhará se
             - diferenças nos nomes das migrações, tipos or checksums encontrados
             - versões aplicadas que não podem ser resolvidas localmente
             - versões resolvidas que não foram aplicadas ainda`);
        this.makeCommand(CommandsEnum.BASELINE, 'Baselines de um database existente, excluindo todas migrações executadas e incluidas em baselineVersion.');
        this.makeCommand(CommandsEnum.REPAIR, `Repara a tabela de metadata do Flyway. Irá executar as seguintes ações:

             -Remover qualquer migração falhada no banco de dados sem transação de DDL
             (Objetos do usuário deixados para trás dever ser limpos manualmente)
             - Corrigir checksums incorretos`);
    }

    public exec(cmd: string) {
        let argv = process.argv;
        argv[2] = "-c";
        argv[3] = "conf/config.js";
        if (cmd) {
            argv[4] = cmd;
        }
        program.parse(argv);

        if (!program.configfile) {
            throw new Error('Arquivo de configurações é requerido, ver https://github.com/dev-senior-com-br/multischemase/blob/master/README.md');
        }

        var config = require(path.resolve(program.configfile));

        if (typeof config === 'function') {
            config = config(this._service, this._tenant);
        }

        download.ensureArtifacts(config, async (err, flywayBin) => {
            try {
                const workingDir = process.cwd();

                if (err) {
                    throw new Error(err);
                }

                const args = this.configFlywayArgs(config)
                    .concat([cmd]);

                const child = spawn(flywayBin, args, {
                    env: Object.assign({}, process.env, config.env),
                    cwd: workingDir,
                    stdio: 'inherit',
                    windowsVerbatimArguments: true // Super Weird, https://github.com/nodejs/node/issues/5060
                });

                child.on('close', code => {
                    process.exit(code);
                });
            } catch (err) {
                console.error('Error: ' + err);
            }
        });
    }

    private makeCommand(name, desc) {
        process.title = 'flyway';
        program
            .version(pkg.version)
            .option('-c, --configfile <file>', 'Um jscript ou arquivo JSON contendo as configurações.')
            .on('--help', () => {
                console.log(' Para verificar as opções de configuração do Flyway\'s: https://flywaydb.org/documentation/commandline/');
            });

        program
            .command(name)
            .description(desc)
            .action(this.exeCommand);
    }

    private configFlywayArgs(config): string[] {
        const flywayArgs = config.flywayArgs || {};
        const flywayArgsKeys = Object.keys(flywayArgs);

        return flywayArgsKeys.map((key) => {
            try {
                return `-${key}=${flywayArgs[key]}`;
            } catch (err) {
                console.error('Error: ' + err);
            }
        });
    }

    private exeCommand(cmd) {
        if (!program.configfile) {
            throw new Error('Arquivo de configurações é requerido, ver https://github.com/dev-senior-com-br/multischemase/blob/master/README.md');
        }

        let config = require(path.resolve(program.configfile));

        if (typeof config === 'function') {
            let service = 'service';
            let tenant = 'teste';
            config = config(service, tenant);
        }

        download.ensureArtifacts(config, async (err, flywayBin) => {
            try {
                const workingDir = process.cwd();

                if (err) {
                    throw new Error(err);
                }

                const args = this.configFlywayArgs(config);

                const child = spawn(flywayBin, args, {
                    env: Object.assign({}, process.env, config.env),
                    cwd: workingDir,
                    stdio: 'inherit',
                    windowsVerbatimArguments: true // Super Weird, https://github.com/nodejs/node/issues/5060
                });

                child.on('close', code => {
                    process.exit(code);
                });
            } catch (err) {
            }
        });
    }
}