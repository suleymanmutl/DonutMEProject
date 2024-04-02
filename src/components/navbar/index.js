import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../navbar/Navbar.module.css';
import Modal from './Modal';
import Faq from './Faq';
import Leaderboard from './leaderboard';
import { Img } from '@chakra-ui/react';
import { TwitterLoginButton } from './twitterAuth'; // Yolunuzun doğru olduğundan emin olun


const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

function Navbar() {
    return (
        <div>
            <div className={styles.ann}>
                <h4>
                    Are you good at Web Development? Write us on{' '}
                    <a href="https://twitter.com/DonutMeNFT" target="_blank">
                        Twitter
                    </a>
                </h4>
            </div>
            <div>
                <div className={styles.navbar}>
                    <div className={styles.logoX}>
                        <Img src="/logo.png" alt="logo" />
                        <TwitterLoginButton />
                    </div>

                    <div className={styles.infoBtn}>
                        <div className={styles.infoBtns}>
                            <Leaderboard />
                            <Faq />
                            <Modal />
                        </div>
                        <WalletMultiButtonDynamic />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
