import encryptAES from '@salesforce/apex/CryptoUtils.encryptAESLT';
import decryptAES from '@salesforce/apex/CryptoUtils.decryptAESLT';

export default class CryptoUtils {

    static encryptAES128(data){
        return new Promise((resolve, reject) => {
            encryptAES({
                alg: 'AES128',
                data: data
            }).then((encryptedData) => {
                resolve(encryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static encryptAES192(data){
        return new Promise((resolve, reject) => {
            encryptAES({
                alg: 'AES192',
                data: data
            }).then((encryptedData) => {
                resolve(encryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static encryptAES256(data){
        return new Promise((resolve, reject) => {
            encryptAES({
                alg: 'AES256',
                data: data
            }).then((encryptedData) => {
                resolve(encryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static decryptAES128(data){
        return new Promise((resolve, reject) => {
            decryptAES({
                alg: 'AES128',
                encriptedBase64: data
            }).then((decryptedData) => {
                resolve(decryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static decryptAES192(data){
        return new Promise((resolve, reject) => {
            decryptAES({
                alg: 'AES192',
                encriptedBase64: data
            }).then((decryptedData) => {
                resolve(decryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static decryptAES256(data){
        return new Promise((resolve, reject) => {
            decryptAES({
                alg: 'AES256',
                encriptedBase64: data
            }).then((decryptedData) => {
                resolve(decryptedData);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}