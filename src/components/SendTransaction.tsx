import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    Keypair,
    SystemProgram,
    Transaction,
    TransactionMessage,
    TransactionSignature,
    VersionedTransaction,
} from '@solana/web3.js';
import { FC, useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import styles from './styles.module.css'; // Stil dosyanızın yolu

interface SendTransactionProps {
    onTransferCompleted: () => void;
}

const SendTransaction: FC<SendTransactionProps> = ({ onTransferCompleted }) => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const receiverPublicKey = 'FiSXuabU8qifYgX6mmwPomUQmBqETXQNmsyAhaYUXTwF';
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(0);

    // Oyun yüklendi mi?
    const [isLoadingGame, setIsLoadingGame] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const savedIsGameLoaded = localStorage.getItem('isGameLoaded');
        if (savedIsGameLoaded === 'true') {
            // Oyun daha önce başlatılmışsa, oyunu tekrar başlat
            const savedRemainingTime = localStorage.getItem('remainingTime');
            if (savedRemainingTime && parseInt(savedRemainingTime) > 0) {
                setIsLoadingGame(true); // Oyunun yüklenmeye başlandığını işaretlemek için
                onTransferCompleted();
            }
        }
    }, [onTransferCompleted]);

    useEffect(() => {
        // Sayfa yüklendiğinde Local Storage'dan kalan süreyi al
        const savedRemainingTime = localStorage.getItem('remainingTime');
        const savedEndTime = localStorage.getItem('endTime');
        const savedIsButtonDisabled = localStorage.getItem('isButtonDisabled');

        if (savedIsButtonDisabled === 'true' && savedRemainingTime && savedEndTime) {
            const remainingTimeInt = parseInt(savedRemainingTime, 10);
            const endTime = parseInt(savedEndTime, 10);
            const currentTime = Date.now();

            // Hesapla sürenin ne kadar süre kaldığını
            const timeRemaining = endTime - currentTime;

            if (timeRemaining > 0) {
                startCountdown(timeRemaining);
            }
        }
    }, []);

    const startCountdown = (initialTime: number) => {
        setIsButtonDisabled(true);
        setRemainingTime(initialTime);

        const endTime = Date.now() + initialTime;

        // Yeni eklenen kod: Bitiş zamanını local storage'a kaydet
        localStorage.setItem('endTime', endTime.toString());

        const countdownInterval = setInterval(() => {
            const currentTime = Date.now();
            const updatedRemainingTime = endTime - currentTime;

            // Kalan süreyi güncelle
            setRemainingTime(updatedRemainingTime);

            // Kalan süreyi Local Storage'a kaydet
            localStorage.setItem('remainingTime', updatedRemainingTime.toString());
        }, 1000);
        setTimeout(() => {
            setIsButtonDisabled(false);
            clearInterval(countdownInterval);
            // Süre dolduğunda Local Storage'dan kalan süre bilgisini temizleyin
            localStorage.removeItem('remainingTime');
            localStorage.removeItem('isButtonDisabled');
            setRemainingTime(0);
            localStorage.setItem('isGameLoaded', 'false');
            window.location.reload();
            setButtonVisible(true); // Süre dolduğunda butonu tekrar göster
        }, initialTime);
    };

    useEffect(() => {
        const endTime = parseInt(localStorage.getItem('endTime') || '0', 10);
        const currentTime = Date.now();

        // Süre bitmişse ve oyun yüklenmişse, oyunun başlatılmaması gerektiğini belirten bir işareti kontrol et
        if (endTime > 0 && currentTime >= endTime) {
            setIsButtonDisabled(false);
            setButtonVisible(true); // Süre dolduğunda butonu gizle
            localStorage.setItem('isGameLoaded', 'false'); // Oyunun yüklenmediğini belirt
        } else {
            // Süre hala devam ediyorsa, kalan süreyi güncelle ve butonu devre dışı bırak
            const remainingTime = endTime - currentTime;
            if (remainingTime > 0) {
                startCountdown(remainingTime);
                setIsButtonDisabled(true);
                setButtonVisible(true);
            }
        }
    }, []);
    // Transaction ID'yi kısalt ve Solscan linkini oluştur
    const shortenTransactionId = (id: string) => id.slice(0, 4) + '...' + id.slice(-4);
    const solscanUrl = `https://solscan.io/tx/${transactionId}`;

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        // Check if the button is already disabled
        if (isButtonDisabled || isLoadingGame) {
            console.log('Button is disabled or game is already loading.');
            return;
        }
        // Check if the button is already disabled
        if (isButtonDisabled) {
            console.log('Button is disabled.');
            return;
        }

        let signature: TransactionSignature = '';
        try {
            setIsLoadingGame(true); // Oyunun yüklenmeye başlandığını işaretlemek için

            // Create instructions to send, in this case a simple transfer
            const instructions = [
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(receiverPublicKey),
                    lamports: 1000000, 
                }),
            ];

            // Get the latest block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash();

            // Create a new TransactionMessage with version and compile it to legacy
            const messageLegacy = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToLegacyMessage();

            // Create a new VersionedTransaction which supports legacy and v0
            const transaction = new VersionedTransaction(messageLegacy);

            // Send transaction and await for signature
            signature = await sendTransaction(transaction, connection);

            // Send transaction and await for signature
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            console.log('Transaction successful!', signature);

            // İşlem başarıyla tamamlandığında bu fonksiyonu çağırın
            const handleTransactionSuccess = (signature: string) => {
                setTransactionId(signature); // İşlem imzasını veya ID'sini ayarlayın
                setTransactionSuccess(true); // Başarı durumunu true olarak ayarlayın

                // 2 saniye sonra mesajı kaldır
                setTimeout(() => setTransactionSuccess(false), 9000);
            };
            handleTransactionSuccess(signature);

            // İşlem başarılı ve oyun yüklendikten sonra butonu gizle
            setButtonVisible(true);

            // startCountdown(24 * 60 * 60 * 1000); 
            const countdownTime = 24 * 60 * 60 * 1000; 
            startCountdown(countdownTime);
            setRemainingTime(countdownTime); 

            localStorage.setItem('remainingTime', (24 * 60 * 60 * 1000).toString());
            localStorage.setItem('isButtonDisabled', 'true');
            localStorage.setItem('isGameLoaded', 'true');

            setIsLoadingGame(false);
            localStorage.setItem('remainingTime', (24 * 60 * 60 * 1000).toString()); // 24 saatlik sayaç başlat

            // İşlem tamamlandığında oyunu yükleme işaretini koy
            onTransferCompleted();
        } catch (error: any) {
            console.log('error', 'Transaction failed!', signature);
            setIsLoadingGame(false); 
        }
    }, [publicKey, connection, sendTransaction, isButtonDisabled, onTransferCompleted, isLoadingGame]);

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const formattedTime = `${hours}h ${minutes % 60}m ${seconds % 60}s`;

        return formattedTime;
    };

    return (
        <div>
            {buttonVisible && ( 
                <div>
                    <button className={styles.playButton} onClick={onClick} disabled={!publicKey || isButtonDisabled}>
                        <span>PLAY GAME</span>
                    </button>
                    {transactionSuccess && (
                        <div className={styles.notification}>
                            <button onClick={() => setTransactionSuccess(false)}>X</button>
                            <p>
                                Transaction successful! &nbsp;
                                <a href={solscanUrl} target="_blank" rel="noopener noreferrer">
                                    TX: {shortenTransactionId(transactionId)}
                                </a>
                            </p>
                        </div>
                    )}
                    {isButtonDisabled && (
                        <div>
                            <p>Remaining Time: {formatTime(remainingTime)}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SendTransaction;
