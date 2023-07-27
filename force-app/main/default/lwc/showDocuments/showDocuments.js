import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getDocuments from '@salesforce/apex/DocumentController.getDocuments';
import { updateRecord, deleteRecord } from 'lightning/uiRecordApi';

const columns = [
  { label: 'Name', fieldName: 'Name', type: 'text', sortable: true },
  { label: 'Document Version', fieldName: 'Document_Version__c', type: 'text', sortable: true },
  { label: 'Document Category', fieldName: 'Document_Category__c', type: 'text', sortable: true },
  {
    type: 'action',
    typeAttributes: {
      rowActions: [
        { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
      ]
    }
  }
];

export default class ShowDocuments extends LightningElement {
  @track documents;
  @track showModal = false;
  @track document = { Id: '', Name: '', Document_Version__c: '', Document_Category__c: '' };

  columns = columns;

  @wire(getDocuments)
  wiredDocuments({ error, data }) {
    if (data) {
      this.documents = data.map((doc) => ({
        ...doc,
        Id: doc.Id,
        Name: doc.Name,
        Document_Version__c: doc.Document_Version__c,
        Document_Category__c: doc.Document_Category__c
      }));
    } else if (error) {
      // Handle the error, if any
    }
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    switch (actionName) {
      case 'edit':
        this.editDocument(row);
        break;
      case 'delete':
        this.deleteDocument(row);
        break;
      default:
        break;
    }
  }

  editDocument(row) {
    this.document = { ...row };
    this.showModal = true;
  }

  deleteDocument(row) {
    deleteRecord(row.Id)
      .then(() => {
        return refreshApex(this.wiredDocuments);
      })
      .catch((error) => {
        // Handle the error, if any
      });
  }

  handleNameChange(event) {
    this.document.Name = event.target.value;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDocument() {
    updateRecord({ fields: this.document })
      .then(() => {
        this.showModal = false;
        return refreshApex(this.wiredDocuments);
      })
      .catch((error) => {
        // Handle the error, if any
      });
  }
}
