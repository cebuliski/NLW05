//front-end
//o http post envia os dados de uma maneira mais escondida (sem aparecer no http da página)
//post é usado para tratar dados sensíveis, ou seja, que não podem aparecer no http da página. Ex: cpf, rg...
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    //função anônima que está retornando um valor
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value = "${state.id}">${state.nome}</option>`
        }

    })
    
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")
    const ufValue = event.target.value
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    //função anônima que está retornando um valor
    .then( res => res.json() )
    .then( cities => {
        
        for( const city of cities ) {
            citySelect.innerHTML += `<option value = "${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false

    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//Itens de coleta
//pegar todos os Li's
const itemsToCollect = document.querySelectorAll(".items-grid li")
for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    //add or remove uma classe com JavaScript
    const itemLi = event.target
    itemLi.classList.toggle("selected")

    //rastreio dos dados
    //console.log('ITEM ID: ', itemId)

    const itemId = itemLi.dataset.id
    //verificar se existem itens selecionados
    //se sim, pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex( (item) => {
        const itemFound = item == itemId //será true or false
        return itemFound
    })

    //se já estiver selecionado, tirar da seleção

    if(alreadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else{
        //se não estiver selecionado, adicionar a seleção
        //adicionar à seleção
        selectedItems.push(itemId)
    }

    //rastreio dos dados
    //console.log('selectedItems: ', selectedItems)

    //console.log(selectedItems)
    //atualizar o campo escondido c/ os itens selecionados
    collectedItems.value = selectedItems

    //Sempre que quiser ver algum erro que o programa está dando, usa o console.log
    //o console.log no front-end sempre será apresentado no console na página html da aplicação (no navegador)
    //o console.log no back-end sempre será apresentado no terminal do visual studio code

}

