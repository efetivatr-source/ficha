function atualizarHorario() {
    var dataAtual = new Date();
    flatpickrInstance.setDate(dataAtual, false);
}

var flatpickrInstance = flatpickr("#datepicker", {
    enableTime: true,
    dateFormat: "d/m/Y   -   H:i",
    defaultDate: new Date(),
});

setInterval(atualizarHorario, 1000);

flatpickr("#datepicker-03", {
    dateFormat: "d/m/Y",
});

flatpickr("#datepicker-02", {
    dateFormat: "d/m/Y",
    defaultDate: "01/01/2024",
});

document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("datepicker-03");
    input.value = "/        /"; // Define o valor inicial como " / / "
});

function formatarCNPJInput(input) {
    var cnpj = input.value.replace(/\D/g, "");
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
    input.value = cnpj; // Atualiza o valor do input com o CNPJ formatado
    return cnpj; // Retorna o CNPJ formatado para ser usado em outras funções
}

const toggleButtons = document.querySelectorAll(".toggle-button");

toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        toggleButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        document.getElementById("opcao").value =
            button.getAttribute("data-value");
    });
});

const fieldset = document.querySelector(".title-02-section");

const fieldsetAside = document.querySelector(".title-03-section");

const select = document.getElementById("select-motivo");

const twoColumns = document.querySelector(".two-columns");

select.addEventListener("change", function () {
    if (select.value === "opt2") {
        // para mudar a opção de ativação faça a substituição por aqui. Por exemplo: select.value === "opt3"
        fieldset.classList.add("active");
        fieldsetAside.classList.add("active");
        twoColumns.classList.add("active");
    } else {
        fieldset.classList.remove("active");
        fieldsetAside.classList.remove("active");
        twoColumns.classList.remove("active");
    }
});

// Função para formatar o CNPJ
function formatarCNPJApi(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");
    return cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
    );
}

// Função para formatar a data de abertura
function formatarData(data) {
    // Separa a data em partes (ano, mês, dia)
    const partes = data.split("-");
    // Reorganiza as partes para o formato desejado (DD/MM/AAAA)
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Função para formatar o CEP
function formatarCEP(input) {
    var cep = input.value.replace(/\D/g, "");
    cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
    input.value = cep;
}

// Chamada da função para formatar o CEP após preencher o campo
document
    .querySelector('input[name="cep"]')
    .addEventListener("input", function (event) {
        formatarCEP(event.target);
    });

// Função para preencher os campos com base no CNPJ
function preencherCampos(cnpj) {
    fetch(`https://minhareceita.org/${cnpj}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector('input[name="titulo-03"]').value =
                data.razao_social;
            document.querySelector('input[name="titulo-04"]').value =
                data.nome_fantasia;

            let endereco = "";

            // Verifica se há tipo de logradouro e adiciona ao endereço
            if (data.descricao_tipo_de_logradouro && data.logradouro) {
                endereco +=
                    data.descricao_tipo_de_logradouro + " " + data.logradouro;
            } else if (data.logradouro) {
                endereco += data.logradouro;
            }

            // Adiciona número do endereço, se disponível
            if (data.numero) {
            endereco += ", " + data.numero;
            }

            // Adiciona complemento ao endereço, se disponível
            if (data.complemento) {
                endereco += ", " + data.complemento;
            }

            document.querySelector('input[name="endereco"]').value = endereco;

            // Preenche o campo de CEP e formata automaticamente
            let inputCEP = document.querySelector('input[name="cep"]');
            inputCEP.value = data.cep;
            formatarCEP(inputCEP);

            // Concatena cidade com UF e preenche o campo
            let cidadeUF = `${data.municipio}/${data.uf}`;
            document.querySelector('input[name="cidade"]').value = cidadeUF;

            // Formata a data de abertura antes de atribuir ao campo
            document.querySelector('input[name="data-empresa"]').value =
                formatarData(data.data_inicio_atividade);
            document.querySelector('input[name="bairro"]').value = data.bairro;
        })
        .catch((error) => console.error("Erro ao consultar CNPJ:", error));
}

// Event listener para o input de CNPJ
document
    .querySelector('input[name="cnpj"]')
    .addEventListener("input", function (event) {
        const cnpj = formatarCNPJInput(event.target);
        preencherCampos(cnpj);
    });

// Concatena cidade com UF e preenche o campo
let cidadeUF = `${data.municipio}/${data.uf}`;
document.querySelector('input[name="cidade"]').value = cidadeUF;
