public class DocumentSortController {
    @AuraEnabled(cacheable=true)
    public static List<Document__c> getSortedDocuments(String columnName, String sortOrder) {
        String query = 'SELECT Id, Name, Document_Version__c, Document_Category__c FROM Document__c';
        
        if (columnName != null && columnName != '') {
            query += ' ORDER BY ' + columnName;
            if (sortOrder == 'desc') {
                query += ' DESC';
            }
        }
        
        return Database.query(query);
    }
}
