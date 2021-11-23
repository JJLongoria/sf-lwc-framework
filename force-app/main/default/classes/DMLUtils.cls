/**
 * Clase WithoutSharing con métodos útiles para gestionar la base de datos. Insert, Update...
 * 
 * @@ Test Class => a_Test_DML_Utils
 */
public Without Sharing class DMLUtils  {
    
    public static final String INSERT_OP = 'insert';
	public static final String UPDATE_OP = 'update';
	public static final String UPSERT_OP = 'upsert';
	public static final String DELETE_OP = 'delete';
	public static final List<String> NOT_ALLOWED_FIELDS = new List<String>{'CreatedDate', 'CreatedBy', 'LastModifiedDate', 'LastModifiedBy'};

	public class Record {
		@AuraEnabled
		public String apiName { get; set; }

		@AuraEnabled
		public Map<String, Object> fields { get; set; }
	}

    public static void  insertDML(SObject record){
        insert record;
    }

    public static void  insertDML(List<SObject> records){
        insert records;
    }
    
    public static void updateDML(SObject record){
        update record;
    }
    
    public static void updateDML(List<SObject> records){
        update records;
    }

    public static void upsertDML(SObject record){
        upsert record;
    }
    
    public static void upsertDML(List<SObject> records){
        upsert records;
    }
    
    public static void deleteDML(SObject record){
        delete record;
    }
    
    public static void deleteDML(List<SObject> records){
        delete records;
    }
    
    @future
    public static void deleteAtFuture(Set<Id> ids){
        Database.delete(new List<Id>(ids));
    }

	@AuraEnabled
	public static List<SObject> createRecords(List<Record> records) {
		try {
            system.debug(records);
			List<SObject> results = new List<SObject>();
			Map<String, List<Record>> recordsByType = getRecordsByType(records);
			for (String apiName : recordsByType.keySet()) {
				List<SObject> processedRecords = processRecords(apiName, recordsByType.get(apiName), INSERT_OP);
				insertDML(processedRecords);
                results.addAll(processedRecords);
			}
			return results;
		} catch (Exception e) {
			throw AuraUtils.AuraException('CreateRecords', e, null);
		}
	}

	@AuraEnabled
	public static List<SObject> updateRecords(List<Record> records) {
		try {
            system.debug(records);
			List<SObject> results = new List<SObject>();
			Map<String, List<Record>> recordsByType = getRecordsByType(records);
			for (String apiName : recordsByType.keySet()) {
				List<SObject> processedRecords = processRecords(apiName, recordsByType.get(apiName), UPDATE_OP);
				updateDML(processedRecords);
                results.addAll(processedRecords);
			}
			return results;
		} catch (Exception e) {
			throw AuraUtils.AuraException('UpdateRecords', e, null);
		}
	}

	@AuraEnabled
	public static List<SObject> upsertRecords(List<Record> records) {
		try {
            system.debug(records);
			List<SObject> results = new List<SObject>();
			Map<String, List<Record>> recordsByType = getRecordsByType(records);
			for (String apiName : recordsByType.keySet()) {
				List<SObject> processedRecords = processRecords(apiName, recordsByType.get(apiName), UPSERT_OP);
				upsertDML(processedRecords);
                results.addAll(processedRecords);
			}
			return results;
		} catch (Exception e) {
			throw AuraUtils.AuraException('UpsertRecords', e, null);
		}
	}

	@AuraEnabled
	public static List<SObject> deleteRecords(List<Record> records) {
		try {
            system.debug(records);
			List<SObject> results = new List<SObject>();
			Map<String, List<Record>> recordsByType = getRecordsByType(records);
			for (String apiName : recordsByType.keySet()) {
				List<SObject> processedRecords = processRecords(apiName, recordsByType.get(apiName), DELETE_OP);
				deleteDML(processedRecords);
                results.addAll(processedRecords);
			}
			return results;
		} catch (Exception e) {
			throw AuraUtils.AuraException('DeleteRecords', e, null);
		}
	}

	private static Map<String, List<Record>> getRecordsByType(List<Record> records) {
		Map<String, List<Record>> recordsByType = new Map<String, List<Record>>();
		for (Record record : records) {
			if (!recordsByType.containsKey(record.apiName))
				recordsByType.put(record.apiName, new List<Record>());
			recordsByType.get(record.apiName).add(record);
		}
		return recordsByType;
	}

	private static List<SObject> processRecords(String apiName, List<Record> records, String operation) {
		List<SObject> recordsToProcess = new List<SObject>();
        Map<String, Schema.SObjectField> objectFieldsMap = Schema.getGlobalDescribe().get(apiName).getDescribe().fields.getMap();
		for (Record record : records) {
			SObject newRecord = Schema.getGlobalDescribe().get(apiName).newSObject();
			for (String fieldName : record.fields.keySet()) {
				if (!NOT_ALLOWED_FIELDS.contains(fieldName)) {
					Schema.SObjectField sObjectField = objectFieldsMap.get(fieldName.toLowerCase());
					if (sObjectField == null)
						continue;
					Schema.DescribeFieldResult fieldDescribe = sObjectField.getDescribe();
					String fieldType = String.valueOf(fieldDescribe.getType()).toLowerCase();
					Object fieldValue = record.fields.get(fieldName);
					Object idFieldvalue = record.fields.get('Id');
					if (fieldName != 'Id') {
						if (!fieldDescribe.isCreateable() && operation == INSERT_OP)
							continue;
						if (fieldType != 'reference' && !fieldDescribe.isUpdateable() && (operation == UPDATE_OP || (String.isEmpty(String.valueOf(idFieldvalue)) && operation == UPSERT_OP) || operation == DELETE_OP))
							continue;
						if (idFieldvalue != null && !String.isEmpty(String.valueOf(idFieldvalue)) && fieldDescribe.isNameField() && (operation == UPDATE_OP || operation == UPSERT_OP || operation == DELETE_OP))
							continue;
					}
					if (fieldValue != null) {
						try {
							if (fieldType == 'date') {
								newRecord.put(fieldName, JSON.deserialize('"' + fieldValue + '"', Date.class));
							} else if (fieldType == 'datetime') {
								newRecord.put(fieldName, JSON.deserialize('"' + fieldValue + '"', DateTime.class));
							} else if (fieldType == 'boolean') {
								newRecord.put(fieldName, Boolean.valueOf(fieldValue));
							} else if (fieldType == 'id' || fieldType == 'reference') {
								newRecord.put(fieldName, Id.valueOf(String.valueOf(fieldValue)));
							} else if (fieldType == 'string') {
								newRecord.put(fieldName, fieldValue);
							} else if (fieldType == 'double' || fieldType == 'percent') {
								newRecord.put(fieldName, Double.valueOf(fieldValue));
							} else if (fieldType == 'integer') {
								newRecord.put(fieldName, Integer.valueOf(fieldValue));
							} else if (fieldType == 'long') {
								newRecord.put(fieldName, Long.valueOf(String.valueOf(fieldValue)));
							} else {
								newRecord.put(fieldName, String.valueOf(fieldValue));
							}
						} catch (Exception ex) {
							system.debug(ex.getMessage());
						}
					}
				}
			}
			recordsToProcess.add(newRecord);
		}
		return recordsToProcess;
	}

	
}