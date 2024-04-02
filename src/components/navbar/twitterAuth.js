import React from 'react'; // React'i içe aktarın
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { authentication } from '../gameone/firebase-config'; // Yolunuzun doğru olduğundan emin olun
import styles from './Navbar.module.css';


export const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();

    signInWithPopup(authentication, provider)
        .then((result) => {
            const user = result.user;

            const displayName = user.reloadUserInfo.providerUserInfo[0].screenName;

            console.log('Successfully logged in', displayName);

            // Kullanıcıyı Firebase Realtime Database'e kaydet
            save(displayName, 0);
        })
        .catch((error) => {
            console.error('Error logging in with Twitter:', error);
        });
};

function save(displayName, newScore) {
    const database = getDatabase();
    const userRef = ref(database, 'users/' + displayName);

    // Önce kullanıcının mevcut yüksek skorunu alın
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const currentHighScore = userData.highScore || 0;

                // Yeni skor mevcut yüksek skordan yüksekse, güncelleyin
                if (newScore > currentHighScore) {
                    set(userRef, {
                        username: displayName,
                        highScore: newScore,
                    });
                }
            } else {
                // Kullanıcı veritabanında yoksa, yeni kullanıcıyı ve skoru ekleyin
                set(userRef, {
                    username: displayName,
                    highScore: newScore,
                });
            }
        })
        .catch((error) => {
            console.log('Error retrieving user data: ', error);
        });
}

// Yüksek skoru güncellemek için kullanılacak fonksiyon
export const updateHighScore = (displayName, newScore) => {
    // save fonksiyonu yeni skor ile çağrılabilir
    save(displayName, newScore);
};

// Twitter ile giriş yapma butonunu içeren bir React bileşeni
export const TwitterLoginButton = () => (
    <div>
        <a className={styles.twButton} onClick={signInWithTwitter}>
            LOGIN WITH TWITTER
        </a>
    </div>
);
