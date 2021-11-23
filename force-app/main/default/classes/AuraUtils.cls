public with sharing class AuraUtils {

    public static AuraHandledException AuraException(String name, Exception e, Object data) {
		Map<String, Object> exceptionData = new Map<String, Object>();
		exceptionData.put('name', name);
		exceptionData.put('message', e.getMessage());
		exceptionData.put('data', data);
		exceptionData.put('stack', e.getStackTraceString());
		exceptionData.put('from', 'Apex');
		return new AuraHandledException(JSON.serialize(exceptionData));
	}
    
}
