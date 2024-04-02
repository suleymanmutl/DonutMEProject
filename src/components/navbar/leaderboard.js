import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from './Navbar.module.css';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const database = getDatabase();
            const usersRef = ref(database, 'users');

            get(usersRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const users = [];
                        snapshot.forEach((userSnapshot) => {
                            const userData = userSnapshot.val();
                            users.push({
                                username: userData.username,
                                highScore: userData.highScore || 0,
                            });
                        });
                        setLeaderboardData(users.sort((a, b) => b.highScore - a.highScore));
                    } else {
                        console.log('No users found.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        };

        fetchLeaderboard();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Eğer kullanıcı Twitter ile giriş yapmışsa, Twitter kullanıcı adını al
                const twitterScreenName = user.reloadUserInfo.providerUserInfo.find(
                    (p) => p.providerId === 'twitter.com'
                )?.screenName;
                setCurrentUsername(twitterScreenName);
            } else {
                setCurrentUsername('');
            }
        });
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Kullanıcıları skorlarına göre sırala
    const sortedData = [...leaderboardData];

    // Mevcut kullanıcının sıralamasını bul
    const currentUserIndex = sortedData.findIndex((user) => user.username === currentUsername);
    const currentUserData = currentUserIndex > -1 ? sortedData[currentUserIndex] : null;
    const isInTop10 = currentUserIndex < 10;

    return (
        <div>
            <div className={styles.modalBody}>
                <a href="#" onClick={() => setIsModalOpen(true)}>
                    LEADERBOARD
                </a>
                {isModalOpen && (
                    <div className={styles.modalLeaderboard}>
                        <div className={styles.modalContentLeaderboard}>
                            <button className={styles.closeButtonTop} onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                            <div className={styles.tableBoard}>
                                <div className={styles.scoreBoard}>
                                    <table className={styles.table}>
                                        <thead className={styles.tableHead}>
                                            <tr className={styles.tableRow}>
                                                <th className={styles.tableHeader}>Rank</th>
                                                <th className={styles.tableHeader}>Username</th>
                                                <th className={styles.tableHeader}>High Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tableBody}>
                                            {sortedData.slice(0, 10).map((user, index) => (
                                                <tr
                                                    key={user.username}
                                                    className={
                                                        user.username === currentUsername ? styles.currentUser : ''
                                                    }
                                                >
                                                    <td className={styles.tableData}>{index + 1}</td>
                                                    <td className={styles.tableData}>{user.username}</td>
                                                    <td className={styles.tableData}>{user.highScore}</td>
                                                </tr>
                                            ))}
                                            {!isInTop10 && currentUserData && (
                                                <>
                                                    <tr>
                                                        <td colSpan="3" className={styles.dots}>
                                                            ...
                                                        </td>
                                                    </tr>
                                                    <tr className={styles.currentUser}>
                                                        <td className={styles.tableData}>{currentUserIndex + 1}</td>
                                                        <td className={styles.tableData}>{currentUserData.username}</td>
                                                        <td className={styles.tableData}>
                                                            {currentUserData.highScore}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
