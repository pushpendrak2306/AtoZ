import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import searchDocuments from '@salesforce/apex/DocumentController.searchDocuments';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
  { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
  { label: 'Document Version', fieldName: 'Document_Version__c', type: 'text' },
  { label: 'Document Category', fieldName: 'Document_Category__c', type: 'text' }, 
  {
    type: 'action',
    typeAttributes: {
      rowActions: [
        // { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
      ]
    }
  }
];

export default class LiveSearch extends LightningElement {
  @track searchTerm = '';
  @track documents;
  @track error;
  @track originalData; // To store the original data before searching
  fldsItemValues = [];
  columns = columns;

  handleSearch(event) {
    this.searchTerm = event.target.value;
    if (this.searchTerm.length >= 2) {
      this.searchDocuments();
    } else {
      this.documents = this.originalData; // Restore original data when the search term is empty
    }
  }

  @wire(searchDocuments, { searchTerm: '$searchTerm' })
  wiredDocuments({ error, data }) {
    if (data) {
      this.documents = data.map((doc) => ({
        ...doc,
        Id: doc.Id,
        Name: doc.Name,
        Document_Version__c: doc.Document_Version__c,
        Document_Category__c: doc.Document_Category__c
      }));
      this.originalData = data; // Store the original data when fetched from the server
      this.error = null;
    } else if (error) {
      this.error = error;
      this.documents = null;
      this.originalData = null;
    }
  }

  searchDocuments() {
    // Implement the searchDocuments method in the "DocumentController" Apex class
    // The method should return a list of Document__c records based on the searchTerm parameter
    // For example:
    // public static List<Document__c> searchDocuments(String searchTerm) {
    //   String query = 'SELECT Id, Name, Document_Version__c, Document_Category__c FROM Document__c ';
    //   query += 'WHERE Name LIKE \'%' + searchTerm + '%\' LIMIT 10';
    //   return Database.query(query);
    // }
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
    // Fire the 'editdocument' event to send the row data to the parent component (DocumentManagement)
    this.dispatchEvent(new CustomEvent('editdocument', { detail: row }));
  }

  deleteDocument(row) {
    deleteRecord(row.Id)
      .then(() => {
        // After deleting, refresh the data
        return refreshApex(this.wiredDocuments);
      })
      .catch((error) => {
        // Handle the error, if any
      });
  }

  saveHandleAction(event) {
    this.fldsItemValues = event.detail.draftValues;
    const inputsItems = this.fldsItemValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });
 
    const promises = inputsItems.map(recordInput => updateRecord(recordInput));
    Promise.all(promises).then(res => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Records Updated Successfully!!',
                variant: 'success'
            })
        );
        this.fldsItemValues = [];
        return this.refresh();
    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'An Error Occured!!',
                variant: 'error'
            })
        );
    }).finally(() => {
        this.fldsItemValues = [];
    });
}



async refresh() {
    await refreshApex(this.documents);
}
}
