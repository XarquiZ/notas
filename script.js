document.addEventListener("DOMContentLoaded", function() {
    // Dados iniciais com os alunos das turmas
    const turmas = {
        operador: {
            alunos: [
               "Adailton Gustavo de Souza Santos",
                "Aguida Fonseca Gregorio",
                "Carlos Eduardo Dias Vilaça",
                "Edilene Protásio de Oliveira Grandini",
                "Jôvania Costa Pereira",
                "Jenifer Silva Almeida",
                "Jônatas da Conceição Silva",
                "Kauan Gabriel Silva Cruz",
                "Liliana Souza Leite",
                "Marina Chagas Coelho",
                "Mileni da Conceição Bezerra Brandão",
                "Nildete Rodrigues dos Santos",
                "Pedro Henrique Santana",
                "Thailane Lima",
                "Rafael Almeida",
                "Sara Silva",
                "Yasmin Pereira",
            ],
            atividades: [],
            notas: {}
        },
        webdesign: {
            alunos: [
                "Amanda Lima dos Reis",
                "Ana Julia Bezerra da Silva Mota",
                "Beatriz Silva Souza",
                "Bruna Ribeiro dos Santos",
                "Eric de Oliveira Santos",
                "João Vitor Souza da Silva",
                "Kaio de Sousa Melo",
                "Guilherme Brito de Souza",
                "Hugo Luiz Santos Oliveira",
                "Kauan Fernandes dos Santos",
                "Marcelo Roberto Guerra Tavares",
                "Thalia Rodrigues de Sousa",
                "Thayssa Vytoria Santos Sousa",
                "William Dell Ova Oliveira Melo",
            ],
            atividades: [],
            notas: {}
        }
    };

    // Carregar dados salvos do localStorage
    function carregarDados() {
        const dadosSalvos = localStorage.getItem("turmas");
        if (dadosSalvos) {
            Object.assign(turmas, JSON.parse(dadosSalvos));
        }
        console.log("Dados carregados:", turmas); // Depuração
        atualizarSeletorAtividades();
        atualizarTabelas();
    }

    // Salvar dados no localStorage
    function salvarDados() {
        localStorage.setItem("turmas", JSON.stringify(turmas));
        console.log("Dados salvos:", turmas); // Depuração
    }

    // Adicionar atividade
    document.getElementById("atividade-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const nomeAtividade = document.getElementById("nome-atividade").value;
        const turma = document.getElementById("turma").value;

        if (!turmas[turma].atividades.includes(nomeAtividade)) {
            turmas[turma].atividades.push(nomeAtividade);
            turmas[turma].notas[nomeAtividade] = {};
            atualizarSeletorAtividades();
            atualizarTabelas();
            salvarDados();
        }

        this.reset();
    });

    // Atualizar seletor de atividades
    function atualizarSeletorAtividades() {
        const seletor = document.getElementById("atividade-selecionada");
        seletor.innerHTML = '<option value="">Todas as Atividades</option>';
        const todasAtividades = [...new Set([...turmas.operador.atividades, ...turmas.webdesign.atividades])];
        todasAtividades.forEach(atividade => {
            const option = document.createElement("option");
            option.value = atividade;
            option.textContent = atividade;
            seletor.appendChild(option);
        });

        seletor.addEventListener("change", atualizarTabelas);
    }

    // Atualizar tabelas dinamicamente
    function atualizarTabelas() {
        const atividadeSelecionada = document.getElementById("atividade-selecionada").value;
        console.log("Atualizando tabelas para atividade:", atividadeSelecionada); // Depuração

        // Tabela Operador de Microcomputador
        const cabecalhoOperador = document.querySelector("#tabela-operador thead tr");
        const corpoOperador = document.getElementById("corpo-operador");
        if (!corpoOperador) console.log("Erro: corpo-operador não encontrado"); // Depuração
        cabecalhoOperador.innerHTML = "<th>Aluno</th>";
        const atividadesExibidasOperador = atividadeSelecionada ? [atividadeSelecionada] : turmas.operador.atividades;
        atividadesExibidasOperador.forEach(atividade => {
            cabecalhoOperador.innerHTML += `<th>${atividade}</th>`;
        });
        corpoOperador.innerHTML = "";
        turmas.operador.alunos.forEach(aluno => {
            let linha = `<tr><td>${aluno}</td>`;
            atividadesExibidasOperador.forEach(atividade => {
                const nota = turmas.operador.notas[atividade]?.[aluno] || "";
                linha += `<td><input type="number" min="0" max="10" value="${nota}" data-aluno="${aluno}" data-atividade="${atividade}" class="nota-operador"></td>`;
            });
            linha += "</tr>";
            corpoOperador.innerHTML += linha;
        });

        // Tabela Web Design
        const cabecalhoWebdesign = document.querySelector("#tabela-webdesign thead tr");
        const corpoWebdesign = document.getElementById("corpo-webdesign");
        if (!corpoWebdesign) console.log("Erro: corpo-webdesign não encontrado"); // Depuração
        cabecalhoWebdesign.innerHTML = "<th>Aluno</th>";
        const atividadesExibidasWebdesign = atividadeSelecionada ? [atividadeSelecionada] : turmas.webdesign.atividades;
        atividadesExibidasWebdesign.forEach(atividade => {
            cabecalhoWebdesign.innerHTML += `<th>${atividade}</th>`;
        });
        corpoWebdesign.innerHTML = "";
        turmas.webdesign.alunos.forEach(aluno => {
            let linha = `<tr><td>${aluno}</td>`;
            atividadesExibidasWebdesign.forEach(atividade => {
                const nota = turmas.webdesign.notas[atividade]?.[aluno] || "";
                linha += `<td><input type="number" min="0" max="10" value="${nota}" data-aluno="${aluno}" data-atividade="${atividade}" class="nota-webdesign"></td>`;
            });
            linha += "</tr>";
            corpoWebdesign.innerHTML += linha;
        });

        // Adicionar eventos para salvar notas
        document.querySelectorAll(".nota-operador, .nota-webdesign").forEach(input => {
            input.addEventListener("change", function() {
                const aluno = this.dataset.aluno;
                const atividade = this.dataset.atividade;
                const turma = this.classList.contains("nota-operador") ? "operador" : "webdesign";
                turmas[turma].notas[atividade] = turmas[turma].notas[atividade] || {};
                turmas[turma].notas[atividade][aluno] = this.value;
                salvarDados();
                atualizarTabelas(); // Atualiza para refletir a nova nota
            });
        });
    }

    // Carregar os dados ao iniciar
    carregarDados();
});