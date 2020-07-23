const axios = require('axios').default;

class Inventory {
    constructor() {
        this.name = document.getElementById('txtName');
        this.brand = document.getElementById('txtBrand');
        this.amount = document.getElementById('txtAmount');
        this.radioYes = document.getElementById('radioYes');
        this.radioNo = document.getElementById('radioNo');
        this.btnAdd = document.getElementById('btnAdicionar');
        this.getItems();
        this.event();
    }

    event() {
        this.btnAdd.onclick = (event) => this.itemValidate(event);
    }

    getItems() {
        axios.get(`http://localhost:3000/inventory`)
            .then(response => {
                this.recoveryItems(response.data.inventory);
                console.log(response.data.inventory);
            })
            .catch(err => {
                console.log(err);
            })
    }

    recoveryItems(data) {
        for (item of data) {
            const html = this.layoutItem(item.name, item.brand, item.amount, item.perishable, item.id);
            this.insertHtml(html);
        }
    }

    itemValidate(event) {
        event.preventDefault();
        if (this.name.value && this.brand.value && this.amount.value && this.radioYes.checked) {
            const itemYes = {
                name: this.name.value,
                brand: this.brand.value,
                amount: this.amount.value,
                perishable: this.radioYes.value
            }
            this.createItem(itemYes);

        } else if (this.name.value && this.brand.value && this.amount.value && this.radioNo.checked) {
            const itemNo = {
                name: this.name.value,
                brand: this.brand.value,
                amount: this.amount.value,
                perishable: this.radioNo.value
            }
            this.createItem(itemNo);

        } else {
            alert('Por favor, preencha todos os campos!');
        }
    }

    createItem(item) {
        axios.post(`http://localhost:3000/inventory`, item)
            .then((response) => {
                const html = this.layoutItem(item.name, item.brand, item.amount, item.perishable);
                this.insertHtml(html);
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    layoutItem(name, brand, amount, perishable, id) {
        return `
        <div class="card" style="width: 15rem;">
        <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${brand}</p>
            <p class="card-text">${amount}</p>  
            <p class="card-text">${perishable}</p>
            <button type="button" class="btn btn-danger delete-item" id="${id}">Deletar</button>

            <button type="button" class="btn btn-warning get-item" id="${id}" data-toggle="modal" 
            data-target="#exampleModal" data-whatever="@mdo">Editar</button>
        </div>
    </div>
        `;
    }

    insertHtml(html) {
        document.getElementById('newItens').innerHTML += html;
    }
}

new Inventory();