import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/index';
import Footer from '../components/footer/index';
import Game from '../components/gameone/index';
import SendTransaction from '../components/SendTransaction';
import Modal from '../components/gameone/warnModal';

const Home: NextPage = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    // Pencere boyutunu kontrol eden fonksiyon
    const checkWindowSize = () => {
        if (window.innerWidth < 870) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    };

    // Component mount edildiğinde ve pencere boyutu değiştiğinde kontrolü yap
    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
        // İlk yükleme için pencere boyutunu kontrol et
        checkWindowSize();

        // Component unmount edildiğinde event listener'ı temizle
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    const startGame = () => {
        setGameStarted(true);
    };

    const [isGameLoaded, setIsGameLoaded] = useState(false);

    const onTransferCompleted = () => {
        setIsGameLoaded(true);
    };

    return (
        <div>
            <Head>
                <title>Donut ME</title>
                <meta
                    name="description"
                    content="DonutME will try to ensure that our users win the Solana award by playing our endless running game .
                    You don’t need to have NFT to play the game. But the purpose of owning an NFT is to earn income ."
                />
                <meta name="keywords" content="donut, game, endless running game, donutme, web3, solana, nft, nft game"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="icon" href="/icon.png" />
            </Head>

            <main>
                <Navbar />
                <SendTransaction onTransferCompleted={onTransferCompleted} />

                {/* Show when game loads */}
                {!isGameLoaded ? !gameStarted ? null : <p>The transfer process is being completed...</p> : <Game />}

                <Footer />
            </main>

            {/* Modal is shown conditionally */}
            {isModalVisible && (
                <Modal show={isModalVisible} onClose={() => setModalVisible(false)}>
                    <div className="modal">
                        <p>
                            Minimizing the screen might mean missing out on the good stuff! <span> (Like me :)</span>{' '}
                            Please expand your screen to fully enjoy the game .
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Home;
