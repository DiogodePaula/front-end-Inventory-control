const axios = require('axios').default;

class Inventory {
    constructor() {
        this.name = document.getElementById('txtName');
        this.brand = document.getElementById('txtBrand');
        this.amount = document.getElementById('txtAmount');
        this.perishable;

        this.radioYes = document.getElementById('radioYes');
        this.radioNo = document.getElementById('radioNo');


        this.nameModal = document.getElementById('nameModal');
        this.brandModal = document.getElementById('brandModal');
        this.amountModal = document.getElementById('amountModal');
        this.yesModal = document.getElementById('radioYesModal');
        this.noModal = document.getElementById('radioNoModal');

        this.btnAdd = document.getElementById('btnAdicionar');
        this.btnUpdate = document.getElementById('btn-update');
        this.id = 0;
        this.getItems();
        this.event();

    }

    event() {
        this.btnAdd.onclick = (event) => this.itemValidate(event);
        this.btnUpdate.onclick = (event) => this.updateItem(this.id);
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

        document.querySelectorAll('.delete-item').forEach(button => {
            button.onclick = event => this.deleteItem(button.id);
        })

        document.querySelectorAll('.get-item').forEach(button => {
            button.onclick = event => this.getItem(button.id);
        })
    }

    deleteItem(id) {
        axios.delete(`http://localhost:3000/inventory/${id}`)
            .then(response => {
                console.log(response);
                alert('Item deleted!');
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    getItem(id) {
        axios.get(`http://localhost:3000/inventory/${id}`)
            .then(response => {
                console.log(response.data.item);

                this.id = id;
                this.nameModal.value = response.data.item[0].name;
                this.brandModal.value = response.data.item[0].brand;
                this.amountModal.value = response.data.item[0].amount;
            })
    }

    updateItem(id) {
        if (this.noModal.value = true) {

            let itemNo = {
                name: this.nameModal.value,
                brand: this.brandModal.value,
                amount: this.amountModal.value,
                perishable: 'não'
            }
            axios.put(`http://localhost:3000/inventory/${id}`, itemNo)
                .then(response => {
                    console.log(response);
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                })

        } else if (this.YesModal.value = true) {

            let itemYes = {
                name: this.name.value,
                brand: this.brand.value,
                amount: this.amount.value,
                perishable: 'sim'
            }
            axios.put(`http://localhost:3000/inventory/${id}`, itemYes)
                .then(response => {
                    console.log(response);
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                })

        } else {
            alert('Por favor, preencha todos os campos!');
        }
    }

    // itemValidateModal(event) {
    //     event.preventDefault();
    //     if (this.nameModal.value && this.brandModal.value && this.amountModal.value && this.yesModal.checked) {
    //         const itemYes = {
    //             name: this.nameModal.value,
    //             brand: this.brandModal.value,
    //             amount: this.amountModal.value,
    //             perishable: this.yesModal.value
    //         }
    //         this.updateItem(itemYes);
    //         console.log(itemYes);
    //     } else if (this.nameModal.value && this.brandModal.value && this.amountModal.value && this.noModal.checked) {
    //         const itemNo = {
    //             name: this.name.value,
    //             brand: this.brand.value,
    //             amount: this.amount.value,
    //             perishable: this.noModal.value
    //         }
    //         this.updateItem(itemNo);
    //         console.log(itemNo);
    //     } else {
    //         alert('Por favor, preencha todos os campos!');
    //     }
    // }

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
            <h3 class="card-title">${name}</h3>               
            <p class="card-text">Marca: ${brand}</p>           
            <p class="card-text">Quantidade: ${amount}</p>             
            <p class="card-text">Perecível: ${perishable}</p>
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