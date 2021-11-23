public without sharing class CryptoUtils {
	private static String privateKey;
	private static String publicKey;
	public static final String RS256 = 'RS256';
	public static final String AES128 = 'AES128';
	public static final String AES192 = 'AES192';
	public static final String AES256 = 'AES256';
    private static final Map<String, Integer> KEY_LENGTH = new Map<String, Integer>{ AES128 => 16, AES192 => 24, AES256 => 32 };

	static {
		if (privateKey == null)
			privateKey = getPrivateKey();
		if (publicKey == null)
            publicKey = getPublicKey();
	}

	public static String base64URLencode(Blob input) {
		String output = encodingUtil.base64Encode(input);
		system.debug('@@Base64');
		system.debug(output);
		output = output.replace('+', '-');
		output = output.replace('/', '_');
		while (output.endsWith('=')) {
			output = output.subString(0, output.length()-1);
		}
		system.debug('@@Base64URL');
		system.debug(output);
		return output;
	}

	public static String base64URLencode(String input) {
		return base64URLencode(Blob.valueOf(input));
	}

	public static String base64URLdecode(String input) {
		input = input.replace('-', '+').replace('_', '/');
		return encodingUtil.base64Decode(input).toString();
	}

	public static Blob base64URLdecodeBytes(String input) {
		input = input.replace('-', '+').replace('_', '/');
		return encodingUtil.base64Decode(input);
	}

	public static String sign(String alg, String content) {
		if (alg == RS256) {
			Blob signature = Crypto.sign('rsa-sha256', Blob.valueOf(content), EncodingUtil.base64Decode(privateKey));
			return base64URLencode(signature);
		}
		return '';
	}

    public static Boolean verifySignature(String data, String signature){
        return Crypto.verify('rsa-sha256', Blob.valueOf(data), base64URLdecodeBytes(signature), EncodingUtil.base64Decode(publicKey));
    }

	public static String getPrivateKey() { 
		String fileContent;
		if (privateKey != null)
			return privateKey;
		if (!Test.isRunningTest()) {
			StaticResource staticResource = [Select Id, Body
			                                 From StaticResource
			                                 Where Name = 'PrivateKey'
			                                 Limit 1];
			//String urlStaticResource = URL.getOrgDomainUrl().toExternalForm() + '/resource/' + String.valueOf(((DateTime)staticResource.get('SystemModStamp')).getTime())+'/PrivateKey';
			fileContent = staticResource.Body.toString().replace('\n', '').removeStart('-----BEGIN PRIVATE KEY-----').remove('-----END PRIVATE KEY-----');
		} else {
			fileContent = 'MIICWwIBAAKBgQCLZFGb5hMfY5DYvXfhQBgjFB3CDDC7lHh3MKXh1bPn0VcXb7Aj9e2KqSa5AmMT67WinBE/s5DAgLf3A2xDEa6n0jpD0ncegBO5/DMq+5z2JhwJyq3gj+CQciYZerJNpbnHQXO3OTwJ2TNcpC6Yw/br/NrlvsOsBZXorSkOaeLm7QIDAQABAoGAZ7vsj9yU9pMeRG4cPOF6FQDvdG2mBrLjQ7BMgtiK3kYITkSsDNcERGDFlIGWQkj0D2Od4o47d0dToNxHQVJzaw/45LKKRFAa1FsETOfZMJm8TYBNNm8kKpL10H+n1ZC8375t3I56iTIcGVZNKzH5+zwhnaveYy8j4WA9XbgP2HECQQC+Ov/bWlg8rIlEsd3dopyDuaQc0ehLwvQI1OKIu9OZdQ8HfbmEbJDWNXzC31S2imGiBAKLEf4KryQyvpu0rotPAkEAu5Wswe+TrBznv0qAxAAkf/0eP65KNdMxgZCv9NZjlF7V8FzapEqn6Z9FYan1jd6E/Wd/ALy/0YC/NShirj8rAwJAUNI4SjXEL2MOnwUCwluIK97/fs8f5rBZhjcMWBOU/yngzMn5u+10S85Fx3WjRDre6DrT6conKNrogjbBaK6PuQJAPusfPRV8tLglS1ZUBmn91Cg0Yyu0nIUwD8NWIYtfbz64B509gOnBlGzlurJlOKaweMakJL0qobzLZascHlH1vQJAWMdN629TBq+kXYAyOkfNRC1We7MZYCyik7JMSJwXM6SjUT8UDwl6mv+9WTamG2eiAuegXn8a3yomH9diGmjXkg==';
		}
		return fileContent.replace('\n', '').replace('\r', '');
	}

	public static String getPublicKey() {
		String fileContent;
		if (publicKey != null)
			return publicKey;
		if (!Test.isRunningTest()) {
			StaticResource staticResource = [Select Id, Body
			                                 From StaticResource
			                                 Where Name = 'PublicKey'
			                                 Limit 1];
			//String urlStaticResource = URL.getOrgDomainUrl().toExternalForm() + '/resource/' + String.valueOf(((DateTime)staticResource.get('SystemModStamp')).getTime())+'/PublicKey';
			fileContent = staticResource.Body.toString().replace('\n', '').removeStart('-----BEGIN PRIVATE KEY-----').remove('-----END PRIVATE KEY-----');
		} else {
			fileContent = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq9dFr6SK8jK77GXzxyVF2aGtZa5gw6PGRXm1ddHPP67OGuO5GjubV9KpDEy/gQRfq7lCU2wAhDYRBRz/oauUAWGYGvhReaHDbAAoue6FCBB8zdcxaxxgxZuSY7+Vonty3nsC0jkfGa+1g11J4DzgIkL+ccO2juzcLo6y1sZyofJA5WfdD44Pc/YY9mH6R6uVBpmHaaq6HGtXahf//86tgTfrwEpYXrdswF8GIDnqOu+nvwhIBD8k95dB5WSzYw3hBeeAQXGH59sm+w9+mGBKBZJqiosKau64+hItrXsERT5uq2rDTwIijFfEJmVDVkXaDzhapF4Kgd3TGDzEQFxsLwIDAQAB';
		}
		return fileContent.replace('\n', '').replace('\r', '');
	}

    public static String encryptAES(String alg, String data){
        Integer keyLength = KEY_LENGTH.get(alg);
        if(keyLength == null)
            throw new WrongAlgorithmException('El algoritmo ' + alg + ' es incorrecto.');
        String key = privateKey.substring(0, keyLength);
        Blob encripted = Crypto.encryptWithManagedIV(alg, Blob.valueOf(key), Blob.valueOf(data));
        return base64URLencode(encripted);
    }

	@AuraEnabled
	public static string encryptAESLT(String alg, String data){
		try {
			return encryptAES(alg, data);
		} catch (WrongAlgorithmException e) {
			throw  AuraUtils.AuraException('WrongAlgorithm', e, null);
		} catch (Exception e) {
			throw  AuraUtils.AuraException('EncryptAES', e, null);
		}
	}

    public static String decryptAES(String alg, String encriptedBase64){
        Integer keyLength = KEY_LENGTH.get(alg);
        if(keyLength == null)
            throw new WrongAlgorithmException('El algoritmo ' + alg + ' es incorrecto.');
        String key = privateKey.substring(0, keyLength);
        Blob base64Decoded = base64URLdecodeBytes(encriptedBase64);
        return Crypto.decryptWithManagedIV(alg, Blob.valueOf(key), base64Decoded).toString();
    }

	@AuraEnabled
	public static string decryptAESLT(String alg, String encriptedBase64){
		try {
			return decryptAES(alg, encriptedBase64);
		} catch (WrongAlgorithmException e) {
			throw  AuraUtils.AuraException('WrongAlgorithm', e, null);
		} catch (Exception e) {
			throw  AuraUtils.AuraException('DecryptAES', e, null);
		}
	}

    class WrongAlgorithmException extends Exception {

    }  
}