public with sharing class DocumentController {
    
    @AuraEnabled(cacheable=true)
    public static List<Document__c> getDocuments() {
        return [SELECT Id, Name, Document_Version__c, Document_Category__c FROM Document__c];
    }
    
    @AuraEnabled
    public static void updateDocument(String documentId, String name) {
        Document__c doc = new Document__c(Id = documentId, Name = name);
        update doc;
    }
    
    @AuraEnabled
    public static void deleteDocument(String documentId) {
        delete new Document__c(Id = documentId);
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Document__c> searchDocuments(String searchTerm) {
        String searchQuery = '%' + searchTerm + '%';
        return [SELECT Id, Name, Document_Version__c, Document_Category__c 
                FROM Document__c 
                WHERE Name LIKE :searchQuery
                ORDER BY Name];
    }
}
