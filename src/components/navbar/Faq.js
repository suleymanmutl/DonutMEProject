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
                    FAQ
                </a> 
                {isModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h1 className={styles.head}>Frequently Asked Questions</h1>
                            <div>
                                <h3 className={styles.question}>What is DonutME ?</h3>
                                <p>
                                    DonutME will try to ensure that our users win the Solana award by playing our
                                    endless running game. You don’t need to have NFT to play the game. But the purpose
                                    of owning an NFT is to earn income .
                                </p>
                            </div>
                            <div>
                                <h3 className={styles.question}>What is the purpose of the game ?</h3>
                                <p>Win the Solana prize by making the highest score in the game .</p>
                            </div>
                            <div>
                                <h3 className={styles.question}>Why is there a fee to enter the game ?</h3>
                                <p>
                                    The fees you have paid will be pooled and distributed to NFT holders and the person
                                    with the highest score .
                                </p>
                            </div>
                            <div>
                                <h3 className={styles.question}>Extras</h3>
                                <p>Read our Medium article for more. It will only take you 2 minutes .</p>
                            </div>

                            <a onClick={closeModal}>GOT IT</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
