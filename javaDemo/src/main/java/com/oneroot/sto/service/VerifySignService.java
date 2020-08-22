package com.oneroot.sto.service;

import org.ethereum.crypto.ECKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.ethereum.crypto.HashUtil;
import java.math.BigInteger;
import org.ethereum.crypto.ECKey.ECDSASignature;
import org.spongycastle.util.encoders.Hex;
import java.security.SignatureException;


@Service
public class VerifySignService {
    private final static Logger log = LoggerFactory.getLogger(VerifySignService.class);

    public boolean verify(String account, String msg, String signature) {
        boolean rc = false;
        account = this.getAccount(account);
        ECDSASignature sig = this.getSign(signature);
        byte[] sha3Msg = this.getHashMsg(msg);

        try {
            ECKey key = ECKey.signatureToKey(sha3Msg, sig.toBase64());
            String address = Hex.toHexString(key.getAddress());
            log.debug("Signature public key: " + Hex.toHexString(key.getPubKey()));
            log.debug("Sender is: " + address);
            rc = key.verify(sha3Msg, sig);
            if(!account.equalsIgnoreCase(address)) {
                rc = false;
            }
        } catch (SignatureException e) {
            log.error(e.getMessage());
        }

        log.debug("rc:"+rc);
        return rc;
    }


    public boolean verifyPersonal(String account, String msg, String signature) {
        String message = "\u0019Ethereum Signed Message:\n" + msg.length() + msg;
        return verify(account, message, signature);

    }

    private String getAccount(String account) {
        if("0x".equalsIgnoreCase(account.substring(0,2))) {
            account = account.substring(2);
        }
        return account;
    }

    private byte[] getHashMsg(String msg) {
        byte[] rawtx = msg.getBytes();
        byte[] sha3Msg = HashUtil.sha3(rawtx);
        return sha3Msg;
    }

    private ECDSASignature getSign(String signature) {
        if("0x".equalsIgnoreCase(signature.substring(0,2))) {
            signature = signature.substring(2);
        }

        String _r = signature.substring(0, 64);
        String _s = signature.substring(64, 128);
        String _v = signature.substring(128, 130);

        BigInteger r = new BigInteger(_r, 16);
        BigInteger s = new BigInteger(_s, 16);
        BigInteger v = new BigInteger(_v, 16);

        ECDSASignature sig = ECDSASignature.fromComponents(r.toByteArray(), s.toByteArray(), v.byteValue());
        return sig;
    }
}
