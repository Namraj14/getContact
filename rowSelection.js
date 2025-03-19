import { LightningElement, api, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/dataTableContacts.getContactList';

export default class RowSelection extends LightningElement {
    buttonLabel = 'Show Contacts';
    @api recordId;
    @track contactData;
    isDatatableVisible = false;
    searchKey = '';

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    ];

    connectedCallback() {
        this.fetchContacts(); // Fetch contacts initially
    }

    fetchContacts() {
        getContactList({ accId: this.recordId, searchKey: this.searchKey })
            .then(result => {
                if (result) {
                    this.contactData = result;
                } else {
                    this.contactData = [];
                }
                console.log('Fetched contacts:', JSON.stringify(this.contactData));
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
                this.contactData = [];
            });
    }

    handleClick(event) {
        const label = event.target.label;
        if (label === 'Show Contacts') {
            this.buttonLabel = 'Hide Contacts';
            this.isDatatableVisible = true;
        } else {
            this.buttonLabel = 'Show Contacts';
            this.isDatatableVisible = false;
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        console.log('Search Key:', this.searchKey);
        this.fetchContacts(); // Call Apex again when search key changes
    }

    handleSelectedRow(event) {
        const selectedRow = event.detail.selectedRows;
        console.log('Selected rows:', JSON.stringify(selectedRow));
    }
}
