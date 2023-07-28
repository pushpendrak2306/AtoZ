public with sharing class DocumentControllerNew {
    @AuraEnabled(cacheable=true)
    public static List<Document__c> searchDocuments(String searchKey, String sortBy, String sortDirection) {
        String searchQuery = 'SELECT Id, Name, Document_Catagory__c, Document_Version__c FROM Document__c WHERE Name LIKE \'%' + searchKey + '%\'';
        if (String.isNotBlank(sortBy) && String.isNotBlank(sortDirection)) {
            searchQuery += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query(searchQuery);
    }

    @AuraEnabled
    public static void updateDocumentName(String documentId, String documentName) {
        Document__c doc = [SELECT Id, Name FROM Document__c WHERE Id = :documentId LIMIT 1];
        doc.Name = documentName;
        update doc;
    }

    @AuraEnabled
    public static void deleteDocument(String documentId) {
        // Perform any necessary checks before deleting, then delete the record
        delete [SELECT Id FROM Document__c WHERE Id = :documentId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Document__c> getSortedDocuments(String sortBy, String sortDirection) {
        String sortQuery = 'SELECT Id, Name, Document_Catagory__c, Document_Version__c FROM Document__c';
        if (String.isNotBlank(sortBy) && String.isNotBlank(sortDirection)) {
            sortQuery += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query(sortQuery);
    }
}
