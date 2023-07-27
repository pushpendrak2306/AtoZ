import { LightningElement,track } from 'lwc';

export default class DocumentManagement extends LightningElement {
  @track documentsToDisplay;

  handleEditDocument(event) {
    // 'event.detail' contains the selected Document's details from LiveSearch
    // You can pass these details to the ShowDocuments component to open the modal for editing.
    const showDocumentsCmp = this.template.querySelector('c-show-documents');
    showDocumentsCmp.editDocument(event.detail);
  }
}
