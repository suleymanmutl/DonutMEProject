import { useState } from 'react';
import styles from './Navbar.module.css';
import { Img } from '@chakra-ui/react';


function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className={styles.modalBody}>
            <a href="#" onClick={openModal}>
                    HOW TO PLAY
                </a>

                
                {isModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h1 className={styles.head}>How To Play</h1>
                            <p> 
                                1. Login with Twitter . (If you don&apos;t log in, you won&apos;t be able to rank . Sowwy )
                                <br />
                                2. Connect your Wallet . (Phantom, Backpack, etc) 
                                <br />
                                3. Click &quot;Play Game&quot; .
                                <br />
                                4. Sign the message and send Solana fee to play the game .
                                <br />
                                5. Play with all your might to be the first :) .
                            </p>
                            <a onClick={closeModal}>GOT IT</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
