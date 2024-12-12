// Lista inicial de convidados e acompanhantes
const allGuests = ["Ana", "Carlos", "João", "Maria"];
const allCompanions = ["Pedro", "Luiza", "Ricardo", "Fernanda"];

// URL da API
const apiUrl = 'http://localhost:3000/confirmations';


// Seleciona os elementos do DOM
const guestForm = document.getElementById('guestForm');
const guestSelect = document.getElementById('guestSelect');
const companionsSelect = document.getElementById('companionsSelect');
const guestList = document.getElementById('guestList');

// Atualiza a lista de convidados disponíveis no dropdown
async function updateGuestSelect() {
    // Busca os dados da API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Cria listas de nomes já confirmados
    const confirmedGuests = data.map(item => item.guest);
    const confirmedCompanions = data.flatMap(item => item.companions);

    // Filtra os convidados e acompanhantes ainda disponíveis
    const availableGuests = allGuests.filter(guest => !confirmedGuests.includes(guest));
    const availableCompanions = allCompanions.filter(companion => !confirmedCompanions.includes(companion));

    // Atualiza o dropdown de convidados
    guestSelect.innerHTML = '<option value="">-- Selecione --</option>';
    availableGuests.forEach(guest => {
        const option = document.createElement('option');
        option.value = guest;
        option.textContent = guest;
        guestSelect.appendChild(option);
    });

    // Atualiza o dropdown de acompanhantes
    companionsSelect.innerHTML = '';
    availableCompanions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionsSelect.appendChild(option);
    });
}

// Atualiza a lista de confirmados no DOM
async function updateGuestList() {
    // Busca os dados da API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Renderiza a lista de confirmados
    guestList.innerHTML = '';
    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.guest} confirmou presença com: ${item.companions.join(', ')}`;
        guestList.appendChild(listItem);
    });
}

// Adiciona um evento ao formulário
guestForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    const guestName = guestSelect.value;
    const companions = Array.from(companionsSelect.selectedOptions).map(option => option.value);

    if (guestName) {
        // Envia os dados para a API
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guest: guestName, companions })
        });

        // Atualiza as listas de convidados e confirmados
        await updateGuestSelect();
        await updateGuestList();

        // Reseta o formulário
        guestSelect.value = '';
        companionsSelect.value = [];
    } else {
        alert('Por favor, selecione um nome válido.');
    }
});

// Inicializa as listas ao carregar a página
async function initialize() {
    await updateGuestSelect();
    await updateGuestList();
}

initialize();

