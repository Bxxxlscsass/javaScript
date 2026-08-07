const readline = require('readline');

// Operational Status Enum Simulation
const Status = {
    OK: "OK",
    ALERTA: "ALERTA",
    CRITICO: "CRITICO",
    DOWN: "DOWN"
};

// Main Server Infrastructure Array with Custom Hardware SLA Thresholds
const infrastructure = [
    { id: 101, name: "Servidor de Producao", ip: "192.168.1.10", cpu: 0, memory: 0, latency: 0, status: Status.OK, limitCpu: 85, limitMemory: 85 },
    { id: 102, name: "Banco de Dados SQL",   ip: "192.168.1.20", cpu: 0, memory: 0, latency: 0, status: Status.OK, limitCpu: 75, limitMemory: 70 }, 
    { id: 103, name: "API Gateway Central",  ip: "192.168.1.30", cpu: 0, memory: 0, latency: 0, status: Status.OK, limitCpu: 80, limitMemory: 80 },
    { id: 104, name: "Servidor de Backup",   ip: "192.168.1.40", cpu: 0, memory: 0, latency: 0, status: Status.OK, limitCpu: 95, limitMemory: 95 }  
];

// Dynamic Array for Incident logs
const incidentLogs = [];
let backgroundIntervalId = null; // Stores interval tracker reference

// Setup Readline Interface for Terminal Menu Input Interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to simulate non-blocking UI delays (Sleep/Timeout)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Telemetry Logic tracking individual device constraints
function updateTelemetry(server) {
    if (server.status === Status.DOWN) {
        server.cpu = 0;
        server.memory = 0;
        server.latency = 9999; // Network Timeout simulation
        return;
    }

    // Realistic hardware load generation
    server.cpu = parseFloat((15 + Math.random() * 80).toFixed(1));
    server.memory = parseFloat((30 + Math.random() * 65).toFixed(1));
    server.latency = parseFloat((5 + Math.random() * 145).toFixed(1));

    // Threshold evaluation matching custom server parameters
    if (server.cpu > server.limitCpu || server.memory > server.limitMemory || server.latency > 120) {
        server.status = Status.CRITICO;
    } else if (server.cpu > (server.limitCpu - 15) || server.memory > (server.limitMemory - 15) || server.latency > 80) {
        server.status = Status.ALERTA;
    } else {
        server.status = Status.OK;
    }

    // Automated Incident Logging for SLA failures
    if (server.status === Status.CRITICO) {
        const now = new Date();
        const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        let component = "REDE";
        let description = `Latencia critica detectada: ${server.latency}ms`;

        if (server.cpu > server.limitCpu) {
            component = "CPU";
            description = `Uso (${server.cpu}%) excedeu o limite customizado de ${server.limitCpu}%`;
        } else if (server.memory > server.limitMemory) {
            component = "MEMORIA";
            description = `Uso (${server.memory}%) excedeu o limite customizado de ${server.limitMemory}%`;
        }

        incidentLogs.push({
            timestamp,
            id: server.id,
            component,
            description
        });
    }
}

// Menu Interface Rendering Control Loop
function showMenu() {
    console.log("\n=========================================================================");
    console.log("           SISTEMA NOC AVANCADO - CONTROLE E TELEMETRIA DE TI (JS)       ");
    console.log("=========================================================================");
    console.log("1. Dashboard de Infraestrutura (Com Limites Customizados)");
    console.log("2. Executar Varredura Geral Manual");
    console.log("3. Visualizar Painel de Incidentes e Histórico de SLA");
    console.log("4. Simular DOWNTIME / Desligamento Manual de Ativo");
    console.log("5. Executar BOOT / Reativação de Ativo em Falha");
    console.log("6. Encerrar Painel de Controle NOC");
    
    // Status tracker message showing if background scanning routine is alive
    const autoStatus = backgroundIntervalId ? "ATIVADA (A cada 5s)" : "DESATIVADA";
    console.log(`7. Alternar Varredura Automatica de Fundo [Status Atual: ${autoStatus}]`);
    
    rl.question("\nEscolha uma opcao: ", async (choice) => {
        switch (choice.trim()) {
            case '1':
                console.log("\n--- DASHBOARD CENTRAL DE INFRAESTRUTURA ---");
                console.log(`${"ID".padEnd(4)} | ${"Nome do Ativo".padEnd(20)} | ${"IP".padEnd(13)} | ${"CPU (Lim)".padEnd(11)} | ${"MEM (Lim)".padEnd(11)} | ${"LAT".padEnd(7)} | ${"STATUS"}`);
                console.log("-".repeat(89));

                infrastructure.forEach(server => {
                    let cpuStr, memStr;
                    if (server.status === Status.DOWN) {
                        cpuStr = "0.0% (--%)";
                        memStr = "0.0% (--%)";
                    } else {
                        cpuStr = `${server.cpu.toFixed(1)}% (${server.limitCpu}%)`;
                        memStr = `${server.memory.toFixed(1)}% (${server.limitMemory}%)`;
                    }

                    console.log(
                        `${String(server.id).padEnd(4)} | ` +
                        `${server.name.padEnd(20)} | ` +
                        `${server.ip.padEnd(13)} | ` +
                        `${cpuStr.padEnd(11)} | ` +
                        `${memStr.padEnd(11)} | ` +
                        `${(server.latency.toFixed(1) + "ms").padEnd(7)} | ` +
                        `${server.status}`
                    );
                });
                showMenu();
                break;

            case '2':
                process.stdout.write("\n[NOC] Requisitando dados dos agentes de monitoramento");
                for (let i = 0; i < 3; i++) {
                    await sleep(300);
                    process.stdout.write(".");
                }
                infrastructure.forEach(updateTelemetry);
                console.log("\n[SUCESSO] Telemetria manual atualizada de acordo com as regras de SLA individuais!");
                showMenu();
                break;

            case '3':
                console.log("\n--- LOG DE INCIDENTES CRITICOS REGISTRADOS ---");
                if (incidentLogs.length === 0) {
                    console.log("Nenhuma quebra de SLA detectada na infraestrutura.");
                } else {
                    console.log(`${"Data/Hora".padEnd(15)} | ${"ID Ativo".padEnd(8)} | ${"Hardware".padEnd(10)} | ${"Detalhes do Incidente"}`);
                    console.log("-".repeat(89));
                    incidentLogs.forEach(log => {
                        console.log(`${log.timestamp.padEnd(15)} | ${String(log.id).padEnd(8)} | ${log.component.padEnd(10)} | ${log.description}`);
                    });
                }
                showMenu();
                break;

            case '4':
                rl.question("\nDigite o ID do servidor que deseja derrubar/desligar: ", (answer) => {
                    const idBusca = parseInt(answer);
                    const server = infrastructure.find(s => s.id === idBusca);

                    if (server) {
                        if (server.status === Status.DOWN) {
                            console.log(`\n[AVISO] O servidor ${server.name} ja se encontra em estado offline (DOWN).`);
                        } else {
                            server.status = Status.DOWN;
                            server.cpu = 0;
                            server.memory = 0;
                            server.latency = 9999;

                            const now = new Date();
                            const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                            
                            incidentLogs.push({
                                timestamp,
                                id: idBusca,
                                component: "SISTEMA",
                                description: "DOWNTIME FORCADO: Desligamento manual pelo administrador"
                            });
                            console.log(`\n[ALERTA NOC] O servidor ${server.name} foi desligado! Status alterado para DOWN.`);
                        }
                    } else {
                        console.log(`\n[ERRO] Nenhum ativo de TI localizado com o ID ${idBusca}.`);
                    }
                    showMenu();
                });
                break;

            case '5':
                rl.question("\nDigite o ID do servidor que deseja reativar (Boot): ", async (answer) => {
                    const idBusca = parseInt(answer);
                    const server = infrastructure.find(s => s.id === idBusca);

                    if (server) {
                        if (server.status !== Status.DOWN) {
                            console.log(`\n[AVISO] O servidor ${server.name} ja esta ativo e operando em rede.`);
                        } else {
                            server.status = Status.OK;
                            process.stdout.write("\n[NOC] Enviando sinal de boot para a maquina...");
                            await sleep(800);
                            updateTelemetry(server); 
                            console.log(`\n[SUCESSO] O servidor ${server.name} foi reiniciado com sucesso e esta online!`);
                        }
                    } else {
                        console.log(`\n[ERRO] Nenhum ativo de TI localizado com o ID ${idBusca}.`);
                    }
                    showMenu();
                });
                break;

            case '6':
                console.log("\nDesconectando do barramento corporativo. Painel NOC desativado.\n");
                if (backgroundIntervalId) clearInterval(backgroundIntervalId); //safely clean loop before exit 
                rl.close();
                break;

            case '7':
                //NEW: Toggles background automated polling state engine
                if (backgroundIntervalId) {
                    clearInterval(backgroundIntervalId);
                    backgroundIntervalId = null;
                    console.log("\n[NOC] Varredura automática desativada!");
                } else {
                    //Triggers polling loop task every 5000ms (5 seconds)
                    backgroundIntervalId = setInterval(() => {
                        infrastructure.forEach(updateTelemetry);
                    }, 5000);
                    console.log("\n[NOC] Varredura automatica de fundo ativada com sucesso! Sensores atualizado a cada 5 segundos.");
                }
                showMenu();
                break;

            default:
                console.log("\nComando invalido! Tente novamente.");
                showMenu();
                break;
        }
    });
}
showMenu();