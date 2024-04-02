import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@mui/material';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import { sign } from 'tweetnacl';
import { useConnection } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
// import { SystemProgram, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';

const SignMessage: FC = () => {
    const { publicKey, signMessage } = useWallet();
    const { connection } = useConnection();
    const [isMessageSigned, setMessageSigned] = useState(false);
    // const receiverPublicKey = '3BZwcnSjM1E1Jmqv77QhfLjqyGsB7ePKxTBhMKMTFE8y';

    const handleGameStart = () => {
        setMessageSigned(true);
    };

    const onClick = useCallback(async () => {
        try {
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            const message = new TextEncoder().encode(
                'Verify to play. \n \n Clicking "Sign" or "Approve" only means you have proved this wallet is owned by you. \n\nThis request will not trigger any blockchain transactions or generate a fee.'
            );
            const signature = await signMessage(message);
            if (!sign.detached.verify(message, signature, publicKey.toBytes()))
                throw new Error('Message signature invalid!');
            else {
                console.log('Message signature is valid.');
                handleGameStart(); // Mesaj başarıyla imzalandığında
            }
        } catch (error: any) {}
        if (!publicKey) {
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }
    }, [publicKey, signMessage]);

    return (
        <div>
            {!isMessageSigned ? (
                <Button onClick={onClick} disabled={!publicKey || !signMessage}>
                    Sign Message
                </Button>
            ) : (
                <span></span>
            )}
        </div>
    );
};
export default SignMessage;
