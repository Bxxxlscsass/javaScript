const readline = require('readline');

// Classe Controladora do Inventário de Tecnologia e Infraestrutura
class InventarioTI {
    constructor() {
        this.ativos = [];
    }

    cadastrarAtivo({ nome, ip, tipo, ramGb, criticidade, localizacao }) {
        if (!nome || !ip || !tipo) {
            throw new Error("Campos obrigatórios ausentes: Nome, IP e Tipo de Ativo são necessários.");
        }

        // Validação básica de formato de IP
        const regexIP = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!regexIP.test(ip.trim())) {
            throw new Error("Formato de endereço IP inválido. Utilize o padrão (Ex: 192.168.1.10).");
        }

        // NOVO: Validador para impedir que duas máquinas usem o mesmo endereço IP
        const ipDuplicado = this.ativos.some(ativo => ativo.ip === ip.trim());
        if (ipDuplicado) {
            throw new Error(`Conflito de Rede! O endereço IP [${ip.trim()}] já está alocado para outro ativo.`);
        }

        const novoAtivo = {
            id: `TEC-${Math.floor(1000 + Math.random() * 9000)}`,
            nome: nome.trim(),
            ip: ip.trim(),
            tipo: tipo.trim(), 
            ramGb: Number(ramGb) || 0,
            criticidade: criticidade ? criticidade.trim() : "Média", 
            localizacao: localizacao ? localizacao.trim() : "Data Center Principal",
            status: "Online", // Status inicial padrão
            cadastradoEm: new Date()
        };
        this.ativos.push(novoAtivo);
        return novoAtivo;
    }

    // NOVO: Rotina para alterar o status operacional do ativo
    atualizarStatus(id, novoStatus) {
        const ativo = this.ativos.find(a => a.id === id.trim().toUpperCase());
        if (!ativo) return false;
        
        ativo.status = novoStatus.trim();
        return true;
    }

    excluirAtivo(id) {
        const tamanhoInicial = this.ativos.length;
        this.ativos = this.ativos.filter(ativo => ativo.id !== id.trim().toUpperCase());
        return this.ativos.length < tamanhoInicial;
    }

    buscar(termo) {
        if (!termo) return this.ativos;
        const termoLimpo = termo.toLowerCase().trim();
        return this.ativos.filter(a => 
            a.nome.toLowerCase().includes(termoLimpo) || 
            a.ip.includes(termoLimpo) ||
            a.tipo.toLowerCase().includes(termoLimpo)
        );
    }

    obterTodos() {
        return this.ativos;
    }

    gerarRelatorio() {
        const total = this.ativos.length;
        if (total === 0) return null;

        const ramTotal = this.ativos.reduce((acc, a) => acc + a.ramGb, 0);
        
        const distribuicaoCriticidade = {};
        const distribuicaoStatus = { "Online": 0, "Offline": 0, "Manutenção": 0 };
        
        this.ativos.forEach(a => {
            distribuicaoCriticidade[a.criticidade] = (distribuicaoCriticidade[a.criticidade] || 0) + 1;
            distribuicaoStatus[a.status] = (distribuicaoStatus[a.status] || 0) + 1;
        });

        return {
            total,
            ramTotal,
            distribuicaoCriticidade,
            distribuicaoStatus
        };
    }
}

// Inicializa o inventário e pré-carrega os ativos de teste
const infraDb = new InventarioTI();
infraDb.cadastrarAtivo({
    nome: "Servidor Web Produção", ip: "192.168.1.50", tipo: "Servidor Linux", 
    ramGb: 64, criticidade: "Crítica", localizacao: "Rack A - Data Center"
});
infraDb.cadastrarAtivo({
    nome: "Roteador de Borda", ip: "200.20.15.1", tipo: "Roteador Cisco", 
    ramGb: 16, criticidade: "Alta", localizacao: "Rack Principal"
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper para formatar a cor do status no console de forma limpa
function formatarStatus(status) {
    if (status === "Online") return `\x1b[32m${status}\x1b[0m`;       // Verde
    if (status === "Offline") return `\x1b[31m${status}\x1b[0m`;      // Vermelho
    if (status === "Manutenção") return `\x1b[33m${status}\x1b[0m`;   // Amarelo
    return status;
}

function exibirMenu() {
    console.log("\n=========================================================================");
    console.log("            SISTEMA CENTRAL DE INVENTÁRIO DE ATIVOS DE TI (NOC)      ");
    console.log("=========================================================================");
    console.log(" 1. Listar Todos os Ativos de TI Cadastrados");
    console.log(" 2. Cadastrar Novo Ativo de TI (Hardware / IP Único)");
    console.log(" 3. Buscar no Inventário (Por Nome, IP ou Tipo)");
    console.log(" 4. Alterar Status Operacional de um Ativo (Online/Offline/Manutenção)");
    console.log(" 5. Dar Baixa / Excluir Ativo do Banco (Por ID)");
    console.log(" 6. Relatório Geral de Infraestrutura e Monitoramento");
    console.log(" 7. Encerrar Painel de Controle de Tecnologia");
    console.log("=========================================================================");
    
    rl.question("\nEscolha uma opção operacional (1-7): ", (opcao) => {
        switch (opcao.trim()) {
            case '1': // LISTAR ATIVOS
                console.log("\n--- INVENTÁRIO ATUAL DE ATIVOS DE TI (HARDWARE) ---");
                const todosAtivos = infraDb.obterTodos();
                if (todosAtivos.length === 0) {
                    console.log("Nenhum ativo de tecnologia catalogado na infraestrutura.");
                } else {
                    console.log(`${"ID".padEnd(8)} | ${"Nome do Ativo".padEnd(25)} | ${"Endereço IP".padEnd(15)} | ${"RAM".padEnd(8)} | ${"Status"}`);
                    console.log("-".repeat(73));
                    todosAtivos.forEach(a => {
                        console.log(
                            `${a.id.padEnd(8)} | ` +
                            `${(a.nome.length > 23 ? a.nome.substring(0,20) + "..." : a.nome).padEnd(25)} | ` +
                            `${a.ip.padEnd(15)} | ` +
                            `${(a.ramGb + " GB").padEnd(8)} | ` +
                            `${formatarStatus(a.status)}`
                        );
                    });
                }
                exibirMenu();
                break;

            case '2': // CADASTRAR NOVO ATIVO
                console.log("\n--- ASSISTENTE DE CADASTRO DE INFRAESTRUTURA ---");
                rl.question("Digite o Nome do Ativo (Ex: Servidor de Email): ", (nome) => {
                    rl.question("Digite o Endereço IP (Ex: 192.168.1.20): ", (ip) => {
                        rl.question("Digite o Tipo do Ativo (Ex: Firewall, VM, Switch): ", (tipo) => {
                            rl.question("Digite a Quantidade de Memória RAM (em GB): ", (ramGb) => {
                                rl.question("Digite o Nível de Criticidade (Baixa, Média, Alta, Crítica): ", (criticidade) => {
                                    rl.question("Digite o Local Físico ou Virtual do Ativo: ", (localizacao) => {
                                        try {
                                            const novoAtivo = infraDb.cadastrarAtivo({
                                                nome, ip, tipo, 
                                                ramGb: parseInt(ramGb), 
                                                criticidade, localizacao
                                            });
                                            console.log(`\n[SUCESSO] Ativo cadastrado com sucesso! ID gerado: ${novoAtivo.id}`);
                                        } catch (err) {
                                            console.log(`\n[ERRO] Cadastro recusado: ${err.message}`);
                                        }
                                        exibirMenu();
                                    });
                                });
                            });
                        });
                    });
                });
                break;

            case '3': // BUSCAR NO INVENTÁRIO
                rl.question("\nDigite o termo de busca (nome, IP ou tipo de equipamento): ", (termo) => {
                    console.log("\n--- RESULTADOS DA BUSCA NO INVENTÁRIO ---");
                    const resultados = infraDb.buscar(termo);
                    if (resultados.length === 0) {
                        console.log("Nenhum ativo de hardware foi localizado para este critério.");
                    } else {
                        resultados.forEach(a => {
                            console.log(` * [${a.id}] ${a.nome} | IP: ${a.ip} | Tipo: ${a.tipo} | Status: [${a.status}] | Local: ${a.localizacao}`);
                        });
                    }
                    exibirMenu();
                });
                break;

            case '4': // ALTERAR STATUS
                console.log("\n--- MODIFICAÇÃO DE STATUS OPERACIONAL ---");
                rl.question("Digite o ID do Ativo (Ex: TEC-1234): ", (idAtivo) => {
                    console.log("Opções de Status: \n 1 - Online\n 2 - Offline\n 3 - Manutenção");
                    rl.question("Escolha o número do novo status: ", (opcaoStatus) => {
                        let statusEscolhido = "";
                        if (opcaoStatus.trim() === '1') statusEscolhido = "Online";
                        else if (opcaoStatus.trim() === '2') statusEscolhido = "Offline";
                        else if (opcaoStatus.trim() === '3') statusEscolhido = "Manutenção";

                        if (statusEscolhido) {
                            const modificado = infraDb.atualizarStatus(idAtivo, statusEscolhido);
                            if (modificado) {
                                console.log(`\n[SUCESSO] O status do ativo ${idAtivo.toUpperCase()} foi atualizado para: ${statusEscolhido}`);
                            } else {
                                console.log(`\n[ERRO] Não foi encontrado nenhum ativo com o ID "${idAtivo}".`);
                            }
                        } else {
                            console.log("\n[ERRO] Opção de status inválida.");
                        }
                        exibirMenu();
                    });
                });
                break;

            case '5': // EXCLUIR ATIVO 
                rl.question("\nDigite o ID do ativo para dar baixa no sistema (Ex: TEC-1234): ", (targetId) => {
                    const excluido = infraDb.excluirAtivo(targetId);
                    if (excluido) {
                        console.log(`\n[SUCESSO] O ativo tecnológico com ID [${targetId.toUpperCase()}] teve sua baixa efetuada.`);
                    } else {
                        console.log(`\n[ERRO] O código identificador "${targetId}" não foi localizado.`);
                    }
                    exibirMenu();
                });
                break;

            case '6': // RELATÓRIO E AUDITORIA 
                console.log("\n--- RELATÓRIO GERAL E AUDITORIA DO DATA CENTER ---");
                const relatorio = infraDb.gerarRelatorio();
                if (!relatorio) {
                    console.log("Resumo indisponível: O inventário está vazio.");
                } else {
                    console.log(` Total de equipamentos Monitorados : ${relatorio.total}`);
                    console.log(` Capacidade Total de Memória RAM   : ${relatorio.ramTotal} GB alocados`);
                    console.log(` Volume de Ativos por Estado: `);
                    Object.keys(relatorio.distribuicaoStatus).forEach(st => {
                        console.log(`   - ${st.padEnd(12)}: ${relatorio.distribuicaoStatus[st]} máquinas`);
                    });
                }
                exibirMenu();
                break;
                
            case '7': // SAIR DO PROGRAMA
                console.log("\nEncerrando comunicação com os agentes de infraestrutura... Painel NOC desativado.\n");
                rl.close();
                break;

            default:
                console.log("\n[OPÇÃO INVÁLIDA] Selecione uma diretiva numérica válida de 1 a 7.");
                exibirMenu();
                break;
        }
    });
}

// Inicialização limpa da chamada da função no escopo global
exibirMenu();


