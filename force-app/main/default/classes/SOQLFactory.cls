public without sharing class SOQLFactory {
    public class WhereCondition {
		@AuraEnabled
		public String field { get; set; }

		@AuraEnabled
		public String operator { get; set; }

		@AuraEnabled
		public Object value { get; set; }
	}

	public class OrderBy {
		@AuraEnabled
		public List<String> fields { get; set; }

		@AuraEnabled
		public String order { get; set; }
	}

	public class GroupBy {
		@AuraEnabled
		public List<String> fields { get; set; }

		@AuraEnabled
		public List<WhereCondition> havingCoditions { get; set; }

		@AuraEnabled
		public String customLogic { get; set; }
	}

	@AuraEnabled(cacheable = true)
	public static List<SObject> cachedQuery(String objectApiName, List<String> fields, List<WhereCondition> whereConditions, String customLogic, GroupBy groupBy, OrderBy orderBy, Integer queryLimit) {
		return query(objectApiName, fields, whereConditions, customLogic, groupBy, orderBy, queryLimit);
	}

	@AuraEnabled
	public static List<SObject> query(String objectApiName, List<String> fields, List<WhereCondition> whereConditions, String customLogic, GroupBy groupBy, OrderBy orderBy, Integer queryLimit) {
		try {
			system.debug(objectApiName);
			system.debug(fields);
			system.debug(whereConditions);
			system.debug(customLogic);
			system.debug(groupBy);
			system.debug(orderBy);
			system.debug(queryLimit);
			if (fields == null)
				fields = new List<String>();
			if (!fields.contains('Id') && !fields.contains('id') && groupBy == null)
				fields.add('Id');
			Map<String, Schema.SObjectField> objectFieldsMap = Schema.getGlobalDescribe().get(objectApiName).getDescribe().fields.getMap();
			String query = 'SELECT ' + String.join(fields, ', ')+' FROM ' + objectApiName;
			if (whereConditions != null && whereConditions.size() > 0) {
				Boolean haveCustomLogic = customLogic != null && !String.isEmpty(customLogic);
				String whereConditionStr = '';
				if (haveCustomLogic)
					whereConditionStr = transformCustomCondition(customLogic, whereConditions.size());
				for (Integer index = whereConditions.size(); index > 0; index--) {
					WhereCondition whereCondition = whereConditions[index - 1];
					if (haveCustomLogic) {
						String conditionValue = '&%' + whereCondition.field + '_' + index + 'a%&'; // Creado para reemplazar las condiciones y evitar reemplazos de valores reales de las queries
						String condition = whereCondition.field + ' ' + whereCondition.operator + ' ' + conditionValue;
						whereConditionStr = whereConditionStr.replace(String.valueOf(index + 'a'), condition);
					} else {
						Schema.SObjectField sObjectField = objectFieldsMap.get(whereCondition.field.toLowerCase());
						String condition = whereCondition.field + ' ' + whereCondition.operator + ' ' + getValue(sObjectField, whereCondition.value);
						if (index == whereConditions.size())
							whereConditionStr += condition;
						else
							whereConditionStr += ' AND ' + condition;
					}
				}
				system.debug('whereConditionStr before');
				system.debug(whereConditionStr);
				if (haveCustomLogic) {
					for (Integer index = whereConditions.size(); index > 0; index--) {
						WhereCondition whereCondition = whereConditions[index - 1];
						Schema.SObjectField sObjectField = objectFieldsMap.get(whereCondition.field.toLowerCase());
						whereConditionStr = whereConditionStr.replace('&%' + whereCondition.field + '_' + index + 'a%&', getValue(sObjectField, whereCondition.value));
					}
				}
				system.debug('whereConditionStr after');
				system.debug(whereConditionStr);
				query += ' WHERE ' + whereConditionStr;
			}
			if (groupBy != null && groupBy.fields != null && groupBy.fields.size() > 0) {
				query += ' GROUP BY ' + String.join(groupBy.fields, ', ');
				if (groupBy.havingCoditions != null && groupBy.havingCoditions.size() > 0) {
					Boolean haveCustomLogic = groupBy.customLogic != null && !String.isEmpty(groupBy.customLogic);
					String havingConditionsStr = '';
					if (haveCustomLogic)
						havingConditionsStr = transformCustomCondition(groupBy.customLogic, groupBy.havingCoditions.size());
					for (Integer index = groupBy.havingCoditions.size(); index > 0; index--) {
						WhereCondition havingCondition = groupBy.havingCoditions[index - 1];
						String conditionValue = '&%' + havingCondition.field + '_' + index + 'a%&'; // Creado para reemplazar las condiciones y evitar reemplazos de valores reales de las queries
						if (haveCustomLogic) {
							String condition = havingCondition.field + ' ' + havingCondition.operator + ' ' + conditionValue;
							havingConditionsStr = havingConditionsStr.replace(String.valueOf(index + 'a'), condition);
						} else {
							Schema.SObjectField sObjectField = objectFieldsMap.get(havingCondition.field.toLowerCase());
							String condition = havingCondition.field + ' ' + havingCondition.operator + ' ' + getValue(sObjectField, havingCondition.value);
							if (index == groupBy.havingCoditions.size())
								havingConditionsStr += condition;
							else
								havingConditionsStr += ' AND ' + condition;
						}
					}
					if (haveCustomLogic) {
						for (Integer index = groupBy.havingCoditions.size(); index > 0; index--) {
							WhereCondition havingCondition = groupBy.havingCoditions[index - 1];
							Schema.SObjectField sObjectField = objectFieldsMap.get(havingCondition.field.toLowerCase());
							havingConditionsStr = havingConditionsStr.replace('&%' + havingCondition.field + '_' + index + 'a%&', getValue(sObjectField, havingCondition.value));
						}
					}
					query += ' HAVING ' + havingConditionsStr;
				}
			}
			if (orderBy != null && orderBy.fields != null && orderBy.fields.size() > 0) {
				query += ' ORDER BY ' + String.join(orderBy.fields, ', ')+' ' + orderBy.order;
			}
			if (queryLimit != null && queryLimit > 0) {
				query += ' LIMIT ' + queryLimit;
			}
			//query += ' WITH SECURITY_ENFORCED';
			system.debug(query);
			return Database.query(query);
		} catch (Exception e) {
			throw AuraUtils.AuraException('SOQLFactory', e, null);
		}
	}

	private static String getValue(Schema.SObjectField sObjectField, Object value) {
		String datatype = 'string';
		if (sObjectField != null) {
			Schema.DescribeFieldResult fieldDescribe = sObjectField.getDescribe();
			datatype = String.valueOf(fieldDescribe.getType()).toLowerCase();
		}
		String result = '';
		if (value == null)
			return 'null';
		if (datatype == 'number' || datatype == 'double' || datatype == 'integer' || datatype == 'long' || datatype == 'decimal' || datatype == 'date' || datatype == 'datetime' || datatype == 'boolean') {
			if (value instanceof List<Object>)
				result = '(' + String.join(transformList((List<Object>)value, false), ', ')+')';
			else
				result = String.valueOf(value);
		} else {
			if (value instanceof List<Object>)
				result = '(' + String.join(transformList((List<Object>)value, true), ', ')+')';
			else
				result = '\'' + value + '\'';
		}
		return result;
	}

	private static List<String> transformList(List<Object> objectList, boolean addQuotes) {
		List<String> result = new List<String>();
		for (Object str : objectList) {
			String value = String.valueOf(str);
			if (addQuotes)
				value = '\'' + value + '\'';
			result.add(value);
		}
		return result;
	}

	private static String transformCustomCondition(String customLogic, Integer whereNumber) {
		if (customLogic.contains(' ')) {
			customLogic = customLogic.replace('(', ' ( ').replace(')', ' ) ');
			String[] conditionsParts = customLogic.split(' ');
			List<String> transformedParts = new List<String>();
			for (String conditionParg : conditionsParts) {
				if (conditionParg.isNumeric())
					transformedParts.add(conditionParg + 'a');
				else
					transformedParts.add(conditionParg);
			}
			customLogic = String.join(transformedParts, ' ');
		} else {
			customLogic = customLogic.replace('(', '').replace(')', '');
			customLogic += 'a';
		}
		return customLogic;
	}
}
