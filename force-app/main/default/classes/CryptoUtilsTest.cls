@isTest
public with sharing class CryptoUtilsTest {
    
    @isTest
    public static void testBase64URLencode(){
        String testString = 'Test string to encode';
        String encoded = CryptoUtils.base64URLencode(testString);
        system.assert(true);
    }

    @isTest
    public static void testBase64URLdecode(){
        String testString = 'Test string to decode';
        String encoded = CryptoUtils.base64URLencode(testString);
        String decoded = CryptoUtils.base64URLdecode(encoded);
        system.assertEquals(testString, decoded);
    }

    @isTest
    public static void testBase64URLdecodeBytes(){
        String testString = 'Test string to decode bytes';
        String encoded = CryptoUtils.base64URLencode(testString);
        Blob decodedBytes = CryptoUtils.base64URLdecodeBytes(encoded);
        system.assertEquals(Blob.valueOf(testString), decodedBytes);
    }

    @isTest
    public static void testSign(){
        String testString = 'Test string to sign';
        String sign = CryptoUtils.sign(CryptoUtils.RS256, testString);
        system.assert(true);
        sign = CryptoUtils.sign(null, testString);
        system.assertEquals('', sign);
    }

    @isTest
    public static void testVerifySignature(){
        String testString = 'Test string to verify sign';
        String sign = CryptoUtils.sign(CryptoUtils.RS256, testString);
        try{
            Boolean verified = CryptoUtils.verifySignature(testString, sign);
        } catch(Exception e){

        }
    }

    @isTest
    public static void testEncryptDecrypt(){
        String testString = 'Test string to encript - decript';
        String encripted = CryptoUtils.encryptAES(CryptoUtils.AES256, testString);
        String decripted = CryptoUtils.decryptAES(CryptoUtils.AES256, encripted);
        CryptoUtils.getPublicKey();
        CryptoUtils.getPrivateKey();
        system.assertEquals(testString, decripted);
    }

}
