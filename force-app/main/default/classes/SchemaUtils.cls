public with sharing class SchemaUtils {
    public static Map<String, String> getObjectFieldsNameMap(String objectApiName) {
        Map<String, String> fieldsMap = new Map<String, String>();
        Schema.SObjectType objectSchema = Schema.getGlobalDescribe().get(objectApiName);
        Map<String, Schema.SObjectField> objectFieldMap = objectSchema.getDescribe().fields.getMap();
        for (String fieldAPIName : objectFieldMap.keySet()) {
            fieldsMap.put(fieldAPIName, objectFieldMap.get(fieldAPIName).getDescribe().getLabel());
        }
        return fieldsMap;
    }

    public static SObjectType getSObjectTypeFromId(String recordId) {
        try {
            Id idVal = Id.valueOf(recordId);
            return getSObjectTypeFromId(idVal);
        } catch (Exception e) {
            return null;
        }
    }

    public static SObjectType getSObjectTypeFromId(Id recordId) {
        return recordId.getSObjectType();
    }

    @AuraEnabled
    public static String getSObjectTypeFromIdLT(String recordId) {
        try {
            Id idVal = Id.valueOf(recordId);
            return getSObjectTypeFromId(idVal).getDescribe().getName();
        } catch (Exception e) {
            throw AuraUtils.AuraException('objectType', e, null);
        }
    }

    public static Schema.SObjectField getSObjectField(SObjectType objectType, String fieldAPIName) {
        Schema.DescribeSObjectResult describe = objectType.getDescribe();
        Map<String, Schema.SObjectField> fields = describe.fields.getMap();
        Schema.SObjectField field = fields.get(fieldAPIName.toLowerCase());
        return field;
    }

    public static List<String> getPicklistValues(SObjectType objectType, String fieldAPIName) {
        List<String> result = new List<String>();
        SObjectField field = getSObjectField(objectType, fieldAPIName);
        if (field != null) {
            Schema.DescribeFieldResult describeField = field.getDescribe();
            for (Schema.PicklistEntry item : describeField.getPicklistValues()) {
                result.add(item.getValue());
            }
        }
        return result;
    }

    @AuraEnabled
    public static List<String> getPicklistValuesLT(String objectApiName, String fieldAPIName) {
        try {
            Schema.sObjectType sObjType = Schema.getGlobalDescribe().get(objectApiName);
            return getPicklistValues(sObjType, fieldAPIName);
        } catch (Exception e) {
            throw AuraUtils.AuraException('picklistValues', e, null);
        }
    }

    public static Map<String, String> getPicklistValuesMap(SObjectType objectType, String fieldAPIName) {
        Map<String, String> values = new Map<String, String>();
        Schema.SObjectField sObjectField = getSObjectField(objectType, fieldAPIName);
        Schema.DescribeFieldResult fieldDescribe = sObjectField.getDescribe();
        List<Schema.PicklistEntry> picklistValues = fieldDescribe.getPicklistValues();
        for (Schema.PicklistEntry value : picklistValues) {
            values.put(value.getValue(), value.getLabel());
        }
        return values;
    }

    @AuraEnabled
    public static List<Object> getPicklistValuesDataLT(String objectApiName, String fieldApiName) {
        try {
            Schema.sObjectType sObjType = Schema.getGlobalDescribe().get(objectApiName);
            List<Object> values = new List< Object>();
            Schema.SObjectField sObjectField = getSObjectField(sObjType, fieldApiName);
            Schema.DescribeFieldResult fieldDescribe = sObjectField.getDescribe();
            List<Schema.PicklistEntry> picklistValues = fieldDescribe.getPicklistValues();
            for (Schema.PicklistEntry value : picklistValues) {
                Map<String, Object> data = new Map<String, Object>();
                data.put('value', value.getValue());
                data.put('label', value.getLabel());
                data.put('active', value.isActive());
                data.put('default', value.isDefaultValue());
                values.add(data);
            }
            return values;
        } catch (Exception e) {
            throw AuraUtils.AuraException('picklistValues', e, null);
        }
    }

    public static Map<String, Map<String, String>> getDependentPicklistValuesMap(SObjectType objectType, String fieldApiName) {
        Schema.SObjectField sObjectField = getSObjectField(objectType, fieldApiName);
        Schema.DescribeFieldResult fieldDescribe = sObjectField.getDescribe();
        Schema.sObjectField controllerField = fieldDescribe.getController();
        if (controllerField == null)
            return null;
        Schema.DescribeFieldResult control = controllerField.getDescribe();
        List<Schema.PicklistEntry> controlEntries = (control.getType() == Schema.DisplayType.Boolean ? null : control.getPicklistValues());

        String base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        Map<String, Map<String, String>> dependentPicklistValues = new Map<String, Map<String, String>>();
        for (Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()) {
            if (entry.isActive()) {
                List<String> base64chars = String.valueOf(((Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(entry))).get('validFor')).split('');
                for (Integer index = 0; index < (controlEntries != null ? controlEntries.size() : 2); index++) {
                    Object controlValue = (controlEntries == null ? (Object) (index == 1) : (Object) (controlEntries[index].isActive() ? controlEntries[index].getLabel() : null));
                    Integer bitIndex = index / 6, bitShift = 5 - Math.mod(index, 6);
                    if (controlValue == null || base64chars.size() <= bitIndex || (base64map.indexOf(base64chars[bitIndex]) & (1 << bitShift)) == 0)
                        continue;
                    controlValue = controlEntries[index].getValue();
                    if (!dependentPicklistValues.containsKey((String) controlValue)) {
                        dependentPicklistValues.put((String) controlValue, new Map<String, String>());
                    }
                    dependentPicklistValues.get((String) controlValue).put(entry.getValue(), entry.getLabel());
                }
            }
        }
        return dependentPicklistValues;
    }

    @AuraEnabled
    public static Map<String, Map<String, String>> getDependentPicklistValuesMapLT(String objectApiName, String fieldApiName) {
        try {
            Schema.sObjectType sObjType = Schema.getGlobalDescribe().get(objectApiName);
            return getDependentPicklistValuesMap(sObjType, fieldAPIName);
        } catch (Exception e) {
            throw AuraUtils.AuraException('dependantPicklistValuesMap', e, null);
        }
    }

    public static String getKeyPrefix(String objectApiName) {
        Schema.sObjectType sObjType = Schema.getGlobalDescribe().get(objectApiName);
        return getKeyPrefix(sObjType);
    }

    public static String getKeyPrefix(SObjectType objectType) {
        return (objectType.getDescribe().getKeyPrefix());
    }

    @AuraEnabled
    public static String getKeyPrefixLT(String objectApiName) {
        try {
            return getKeyPrefix(objectApiName);
        } catch (Exception e) {
            throw AuraUtils.AuraException('keyPrefix', e, null);
        }
    }

    @AuraEnabled
    public static SObjectDescribe describeSObjectLT(String objectApiName) {
        try {
            SObjectDescribe describe = new SObjectDescribe();
            Schema.SObjectType objectSchema = Schema.getGlobalDescribe().get(objectApiName);
            Schema.DescribeSObjectResult describeSObject = objectSchema.getDescribe();
            mapSObjectDescribeData(describe, describeSObject);
            Map<String, Schema.SObjectField> fieldsMap = describeSObject.fields.getMap();
            mapSObjectFieldsDescribeData(describe, fieldsMap);
            List<Schema.RecordTypeInfo> recordTypes = describeSObject.getRecordTypeInfos();
            mapSObjectRecordTypesDescribeData(describe, recordTypes);
            List<Schema.ChildRelationship> childRels = describeSObject.getChildRelationships();
            mapSObjectChildRelsDescribeData(describe, childRels);
            return describe;
        } catch (Exception e) {
            throw AuraUtils.AuraException('describeSObject', e, null);
        }
    }

    private static void mapSObjectDescribeData(SObjectDescribe result, Schema.DescribeSObjectResult describeSObject) {
        result.apiName = describeSObject.getName();
        result.createable = describeSObject.isCreateable();
        result.custom = describeSObject.isCustom();
        result.deletable = describeSObject.isDeletable();
        result.feedEnabled = describeSObject.isFeedEnabled();
        result.keyPrefix = describeSObject.getKeyPrefix();
        result.label = describeSObject.getLabel();
        result.labelPlural = describeSObject.getLabelPlural();
        result.mruEnabled = describeSObject.isMruEnabled();
        result.queryable = describeSObject.isQueryable();
        result.searchable = describeSObject.isSearchable();
        result.updateable = describeSObject.isUpdateable();
    }

    private static void mapSObjectFieldsDescribeData(SObjectDescribe result, Map<String, Schema.SObjectField> fieldsMap) {
        if (fieldsMap == null)
            return;
        result.fields = new Map<String, SObjectFieldDescribe>();
        result.nameFields = new List<String>();
        for (String fieldKey : fieldsMap.keySet()) {
            SObjectFieldDescribe describeResult = new SObjectFieldDescribe();
            Schema.DescribeFieldResult fieldDescribe = fieldsMap.get(fieldKey).getDescribe();
            describeResult.apiName = fieldDescribe.getName();
            describeResult.calculated = fieldDescribe.isCalculated();
            if (fieldDescribe.getController() != null)
                describeResult.controllerName = fieldDescribe.getController().getDescribe().getName();
            describeResult.createable = fieldDescribe.isCreateable();
            describeResult.custom = fieldDescribe.isCustom();
            describeResult.dataType = fieldDescribe.getType().name();
            describeResult.filterable = fieldDescribe.isFilterable();
            describeResult.htmlFormatted = fieldDescribe.isHtmlFormatted();
            describeResult.inlineHelpText = fieldDescribe.getInlineHelpText();
            describeResult.label = fieldDescribe.getLabel();
            describeResult.length = fieldDescribe.getLength();
            describeResult.nameField = fieldDescribe.isNameField();
            if (describeResult.nameField) {
                result.nameFields.add(describeResult.apiName);
            }
            describeResult.precision = fieldDescribe.getPrecision();
            if (fieldDescribe.referenceto != null && fieldDescribe.referenceto.size() > 0) {
                describeResult.reference = true;
                describeResult.referenceToInfos = new List<SObjectFieldReferenceToDescribe>();
                for (SObjectType objType : fieldDescribe.referenceto) {
                    SObjectFieldReferenceToDescribe referenteTo = new SObjectFieldReferenceToDescribe();
                    Schema.DescribeSObjectResult describeSObject = objType.getDescribe();
                    referenteTo.apiName = describeSObject.getName();
                    describeResult.referenceToInfos.add(referenteTo);
                }
            }
            describeResult.relationshipName = fieldDescribe.getRelationshipName();
            describeResult.required = !fieldDescribe.isNillable();
            describeResult.searchPrefilterable = fieldDescribe.isSearchPrefilterable();
            describeResult.scale = fieldDescribe.getScale();
            describeResult.sortable = fieldDescribe.isSortable();
            describeResult.unique = fieldDescribe.isUnique();
            describeResult.updateable = fieldDescribe.isUpdateable();
            result.fields.put(fieldKey.toLowerCase(), describeResult);
        }
        // result.nameFields =
    }

    private static void mapSObjectRecordTypesDescribeData(SObjectDescribe result, List<Schema.RecordTypeInfo> recordTypes) {
        if (recordTypes == null)
            return;
        result.recordTypeInfos = new Map<String, RecordTypeDescribe>();
        for (Schema.RecordTypeInfo rtInfo : recordTypes) {
            RecordTypeDescribe rtDescribe = new RecordTypeDescribe();
            if (rtInfo.isDefaultRecordTypeMapping())
                result.defaultRecordTypeId = rtInfo.getRecordTypeId();
            rtDescribe.available = rtInfo.isAvailable();
            rtDescribe.active = rtInfo.isActive();
            rtDescribe.devName = rtInfo.getDeveloperName();
            rtDescribe.recordTypeId = rtInfo.getRecordTypeId();
            rtDescribe.master = rtInfo.isMaster();
            rtDescribe.name = rtInfo.getName();
            result.recordTypeInfos.put(rtDescribe.devName, rtDescribe);
        }
    }

    private static void mapSObjectChildRelsDescribeData(SObjectDescribe result, List<Schema.ChildRelationship> childRels) {
        if (childRels == null)
            return;
        result.childRelationships = new List<ChildRelationshipDescribe>();
        for (Schema.ChildRelationship childRel : childRels) {
            ChildRelationshipDescribe relDescribe = new ChildRelationshipDescribe();
            relDescribe.childObjectApiName = childRel.getChildSObject().getDescribe().getName();
            relDescribe.fieldName = childRel.getField().getDescribe().getName();
            relDescribe.relationshipName = childRel.getRelationshipName();
            relDescribe.junctionIdListNames = childRel.getJunctionIdListNames();
            relDescribe.junctionReferenceTo = childRel.getJunctionIdListNames();
            result.childRelationships.add(relDescribe);
        }
    }

    public class SObjectDescribe {
        @AuraEnabled
        public String apiName { get; set; }

        @AuraEnabled
        public String associateEntityType { get; set; }

        @AuraEnabled
        public String associateParentEntity { get; set; }

        @AuraEnabled
        public List<ChildRelationshipDescribe> childRelationships { get; set; }

        @AuraEnabled
        public Boolean createable { get; set; }

        @AuraEnabled
        public Boolean custom { get; set; }

        @AuraEnabled
        public String defaultRecordTypeId { get; set; }

        @AuraEnabled
        public Boolean deletable { get; set; }

        @AuraEnabled
        public Map<String, Object> dependentFields { get; set; }

        @AuraEnabled
        public Boolean feedEnabled { get; set; }

        @AuraEnabled
        public Map<String, SObjectFieldDescribe> fields { get; set; }

        @AuraEnabled
        public String keyPrefix { get; set; }

        @AuraEnabled
        public String label { get; set; }

        @AuraEnabled
        public String labelPlural { get; set; }

        @AuraEnabled
        public Boolean layoutable { get; set; }

        @AuraEnabled
        public Boolean mruEnabled { get; set; }

        @AuraEnabled
        public List<String> nameFields { get; set; }

        @AuraEnabled
        public Boolean queryable { get; set; }

        @AuraEnabled
        public Map<String, RecordTypeDescribe> recordTypeInfos { get; set; }

        @AuraEnabled
        public Boolean searchable { get; set; }

        @AuraEnabled
        public SObjectThemeInfo themeInfo { get; set; }

        @AuraEnabled
        public Boolean updateable { get; set; }
    }

    public class SObjectFieldDescribe {
        @AuraEnabled
        public String apiName { get; set; }

        @AuraEnabled
        public Boolean calculated { get; set; }

        @AuraEnabled
        public Boolean compound { get; set; }

        @AuraEnabled
        public String compoundComponentName { get; set; }

        @AuraEnabled
        public String compoundFieldName { get; set; }

        @AuraEnabled
        public String controllerName { get; set; }

        @AuraEnabled
        public List<String> controllingFields { get; set; }

        @AuraEnabled
        public Boolean createable { get; set; }

        @AuraEnabled
        public Boolean custom { get; set; }

        @AuraEnabled
        public String dataType { get; set; }

        @AuraEnabled
        public String extraTypeInfo { get; set; }

        @AuraEnabled
        public Boolean filterable { get; set; }

        @AuraEnabled
        public SObjectFieldLookupDescribe filteredLookupInfo { get; set; }

        @AuraEnabled
        public Boolean highScaleNumber { get; set; }

        @AuraEnabled
        public Boolean htmlFormatted { get; set; }

        @AuraEnabled
        public String inlineHelpText { get; set; }

        @AuraEnabled
        public String label { get; set; }

        @AuraEnabled
        public Integer length { get; set; }

        @AuraEnabled
        public Boolean nameField { get; set; }

        @AuraEnabled
        public Boolean polymorphicForeignKey { get; set; }

        @AuraEnabled
        public Integer precision { get; set; }

        @AuraEnabled
        public Boolean reference { get; set; }

        @AuraEnabled
        public String referenceTargetField { get; set; }

        @AuraEnabled
        public List<SObjectFieldReferenceToDescribe> referenceToInfos { get; set; }

        @AuraEnabled
        public String relationshipName { get; set; }

        @AuraEnabled
        public Boolean required { get; set; }

        @AuraEnabled
        public Boolean searchPrefilterable { get; set; }

        @AuraEnabled
        public Integer scale { get; set; }

        @AuraEnabled
        public Boolean sortable { get; set; }

        @AuraEnabled
        public Boolean unique { get; set; }

        @AuraEnabled
        public Boolean updateable { get; set; }
    }

    public class SObjectFieldLookupDescribe {
        @AuraEnabled
        public List<String> controllingFields { get; set; }

        @AuraEnabled
        public Boolean dependent { get; set; }

        @AuraEnabled
        public Boolean optionalFilter { get; set; }
    }

    public class SObjectFieldReferenceToDescribe {
        @AuraEnabled
        public String apiName { get; set; }

        @AuraEnabled
        public List<String> nameFields { get; set; }
    }

    public class RecordTypeDescribe {
        @AuraEnabled
        public Boolean available { get; set; }

        @AuraEnabled
        public Boolean active { get; set; }

        @AuraEnabled
        public Boolean defaultRecordTypeMapping { get; set; }

        @AuraEnabled
        public Boolean master { get; set; }

        @AuraEnabled
        public String name { get; set; }

        @AuraEnabled
        public String devName { get; set; }

        @AuraEnabled
        public String recordTypeId { get; set; }
    }

    public class ChildRelationshipDescribe {
        @AuraEnabled
        public String childObjectApiName { get; set; }

        @AuraEnabled
        public String fieldName { get; set; }

        @AuraEnabled
        public List<String> junctionIdListNames { get; set; }

        @AuraEnabled
        public List<String> junctionReferenceTo { get; set; }

        @AuraEnabled
        public String relationshipName { get; set; }
    }

    public class SObjectThemeInfo {
        @AuraEnabled
        public String color { get; set; }

        @AuraEnabled
        public String iconUrl { get; set; }
    }
}