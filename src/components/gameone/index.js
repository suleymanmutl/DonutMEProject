import kaboom from 'kaboom';
import { getHighScore } from './score.js'; // score.js dosyasını içe aktar
import React from 'react';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { authentication } from './firebase-config';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { PublicKey } from '@solana/web3.js';

export function setHighScore(newHighScore) {
    const database = getDatabase();
    const user = authentication.currentUser;

    if (user && !user.isAnonymous) {
        const userId = user.reloadUserInfo.providerUserInfo[0].screenName;
        const highScoreRef = ref(database, `users/${userId}/highScore`);

        const highScoreCallback = (snapshot) => {
            const highScore = snapshot.val();

            // Yüksek skoru güncelleme işlemlerini burada yapabilirsiniz
            // Örneğin, yeni bir yüksek skor elde edildiğinde:
            if (newHighScore > highScore) {
                set(highScoreRef, newHighScore)
                    .then(() => {
                        console.log('New high score recorded:', newHighScore);
                    })
                    .catch((error) => {
                        console.error('Error while updating high score:', error);
                    });
            }
        };

        // İlk olarak veritabanından yüksek skoru almak için tetikleyiciyi başlatın
        onValue(highScoreRef, highScoreCallback);
    }
}

const database = getDatabase();
const usersRef = ref(database, 'users');

// Tüm kullanıcıları almak için bir sorgu yapın
get(usersRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const users = [];
            snapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                users.push({
                    username: userData.username,
                    highScore: userData.highScore,
                });
            });
            // Kullanıcıları ve skorları alın
            // Daha sonra bu verileri sıralayarak bir skor tablosu oluşturabilirsiniz
        } else {
            console.log('User not found.');
        }
    })
    .catch((error) => {
        console.error('Error retrieving data:', error);
    });

const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!gameStarted) {
            // Oyunun duraklatma durumunu tutacak değişken

            kaboom({
                global: true, // Oyun motorunu yalnızca bir kez başlat
                width: 1240,
                height: 360,
                scale: 0.7,
                canvas: document.getElementById('game'), // mevcut bir canvas kullanın
                debug: true,
            });
            // Sounds
            loadSound('confeti', '/confeti.mp3');
            // Background Sprites
            loadSprite('background', '/background.png');
            loadSprite('gameover', '/gameoverBg.png');
            // Obstacle Sprites
            loadSprite('obstacle1', '/fork1.png');
            loadSprite('obstacle2', '/fork1x.png');
            loadSprite('knife', '/knife.png');
            // Ground Sprites
            loadSprite('floor1', '/ground.png');
            loadSprite('floor2', '/groundx.png');
            // Font
            loadFont('PixelFont', '/pixelfont.ttf');

            // Anim Sprites
            loadSprite('milk', '/milk-spritesheet.png', {
                sliceX: 8,
                sliceY: 1,
                anims: {
                    idle: {
                        from: 0,
                        to: 7,
                        loop: true,
                    },
                },
            });

            loadSprite('run-donut', '/run-donut.png', {
                sliceX: 3,
                sliceY: 1,
                anims: {
                    idle: {
                        from: 0,
                        to: 2,
                        loop: true,
                    },
                },
            });

            loadSprite('jump-donut1', '/jump-donut1.png', {
                sliceX: 2,
                sliceY: 1,
                anims: {
                    jump: {
                        from: 0,
                        to: 1,
                        speed: 2,
                        loop: true,
                    },
                },
            });

            scene('game', () => {
                setGravity(1600);
                const bg = add([
                    sprite('background', { width: width(), height: height() }),
                    anchor('center'),
                    pos(width() / 2, height() / 2),
                ]);

                //Score
                let score = 0;

                const scoreLabel = add([
                    text(score, {
                        font: 'PixelFont',
                    }),
                    pos(width() / 2.3, 10),
                    scale(1.5),
                    color(34, 34, 34),
                ]);

                let timer = 0;
                let isSoundPlayed = false;

                onUpdate(() => {
                    timer += dt();
                    if (timer >= 0.1) {
                        score += 1;
                        scoreLabel.text = score;
                        timer = 0;
                    }
                    // Skor 250 olduğunda ve ses daha önce çalınmadıysa sesi çal
                    if (score > 1500 && !isSoundPlayed) {
                        play('confeti');
                        isSoundPlayed = true;
                    }
                });

                const donut = add([
                    sprite('run-donut'),
                    pos(50, 200),
                    area(),
                    body(),
                    scale(3),
                    anchor('center'),
                    {
                        isCurrentlyJumping: true,
                        sprites: {
                            idle: 'run-donut',
                            jump: 'jump-donut1',
                            // run: 'run-donut1',
                        },
                    },
                ]);

                donut.play('idle');

                function resetPlayerToIdle(donut) {
                    donut.use(sprite('run-donut'));
                    donut.play('idle');
                }

                // Zıplama işlevini tanımlama
                function makeJump(donut) {
                    if (donut.isGrounded()) {
                        donut.jump();
                        donut.use(sprite('jump-donut1')); // Zıplama animasyonunu başlatın
                        donut.play('jump');
                        // play('jump-sound');
                        donut.isCurrentlyJumping = true;
                    }
                }

                function resetAfterJump(donut) {
                    if (donut.isGrounded() && donut.isCurrentlyJumping) {
                        donut.isCurrentlyJumping = false; // Karakterin artık zıplamadığını belirtin.
                        resetPlayerToIdle(donut); // Karakteri idle veya koşu animasyonuna döndür.
                    }
                }

                // space,up jump section
                onKeyDown('space', () => {
                    makeJump(donut);
                });
                onKeyDown('up', () => {
                    makeJump(donut);
                });

                // Aşağı ok tuşuna basıldığında tetiklenecek olay
                onKeyPress('down', () => {
                    if (donut.isCurrentlyJumping) {
                        // Zıplama animasyonu devam ederken bir kez aşağı hareket etmesini sağla
                        donut.isCurrentlyJumping = false; // Hava durumunu güncelle
                        donut.jump(-600);
                        donut.use(sprite('run-donut')); // Zıplama animasyonunu başlatın
                        donut.play('idle');
                    }
                });

                donut.onUpdate(() => resetAfterJump(donut));

                function calculateTreeSpeed() {
                    const baseSpeed = 550; // Temel hız
                    const speedIncreasePer100Points = 100; // Her 100 puanlık artış için hız artışı
                    return baseSpeed + Math.floor(score / 100) * speedIncreasePer100Points;
                }
                function calculateSpawnRate() {
                    const baseRate = 1.5; // Temel spawn oranı, saniye cinsinden
                    const rateIncreasePer100Points = -0.05; // Her 100 puanlık artış için spawn oranında azalma
                    const minRate = 0.5; // Spawn oranının düşebileceği minimum saniye
                    let currentRate = baseRate + Math.floor(score / 100) * rateIncreasePer100Points;
                    return Math.max(currentRate, minRate); // Spawn oranını minimum değerin altına düşürme
                }

                //add tree
                function spawnFly() {
                    const treeSpeed = calculateTreeSpeed(); // cactus2 için hızı hesapla

                    // cactus2 engelinin özelliklerini belirleyin
                    const flymilk = add([
                        sprite('milk'),
                        area(),
                        pos(width(), height() / 2 - 120),
                        rotate(20),
                        move(LEFT, treeSpeed), // Sola doğru hareket etmesini sağla
                        {
                            isMilkIdle: true,
                            sprites: {
                                idle: 'milk',
                            },
                        },
                        'milk',
                    ]);
                    flymilk.play('idle');

                    // destryo tree
                    function destroyFly() {
                        wait(rand(2, 2.1), () => {
                            destroy(flymilk);
                        });
                    }

                    wait(rand(1, 4), () => {
                        spawnFly();
                        destroyFly();
                        // 1 ile 3 saniye arasında fonksiyonu çalıştır
                    });
                }
                wait(20, () => {
                    spawnFly();
                });

                function spawnFlyKnife() {
                    const treeSpeed = calculateTreeSpeed(); // cactus2 için hızı hesapla

                    // cactus2 engelinin özelliklerini belirleyin
                    const flyknife = add([
                        sprite('knife'), // "cactus2" sprite'ını kullan
                        area(),
                        pos(width(), height() / 2 - 50), // Canvas'ın ortasında spawn olacak şekilde ayarla
                        // anchor('center'),
                        scale(1.2),
                        rotate(-90),
                        anchor('center'),
                        move(LEFT, treeSpeed), // Sola doğru hareket etmesini sağla
                        'knife',
                    ]);

                    // destryo tree
                    function destroyFlyKnife() {
                        wait(rand(2, 2.1), () => {
                            destroy(flyknife);
                        });
                    }

                    wait(rand(1, 10), () => {
                        spawnFlyKnife();
                        destroyFlyKnife();
                    });
                }
                wait(35, () => {
                    spawnFlyKnife();
                });
                function spawnTree() {
                    const treeType = Math.random() < 0.5 ? 'obstacle1' : 'obstacle2';

                    const treeSpeed = calculateTreeSpeed(); // Ağaç hızını hesapla
                    const tree = add([
                        sprite(treeType),
                        area(),
                        pos(width(), height() - 70),
                        scale(1.2),
                        anchor('center'),
                        move(LEFT, treeSpeed),
                        'fork',
                    ]);

                    // destryo tree
                    function destroyTree() {
                        wait(rand(2, 2.1), () => {
                            destroy(tree);
                        });
                    }

                    wait(rand(0.5, 2), () => {
                        spawnTree();
                        destroyTree();
                    });
                }
                wait(2, () => {
                    spawnTree();
                });

                const floorWidth = width(); // Ekran genişliği
                const floorHeight = 50; // Zeminin yüksekliği

                // Zemin sprite'larını oluştur
                const floor1 = add([
                    sprite('floor1'),
                    pos(0, height() - floorHeight),
                    area(),
                    body({ isStatic: true }),
                ]);
                const floor2 = add([
                    sprite('floor2'),
                    pos(floorWidth, height() - floorHeight),
                    area(),
                    body({ isStatic: true }),
                ]); // İkinci zemini birincinin hemen sağında başlat

                // Her frame'de çalışacak güncelleme fonksiyonu
                onUpdate(() => {
                    const currentSpeed = calculateTreeSpeed(); // Skora göre güncel hızı hesapla

                    // Zeminleri sola doğru hareket ettir
                    floor1.pos.x -= currentSpeed * dt();
                    floor2.pos.x -= currentSpeed * dt();

                    // Eğer bir zemin belirli bir noktaya ulaşırsa, onu ekranın sağ tarafına al
                    if (floor1.pos.x <= -floorWidth) {
                        floor1.pos.x = floor2.pos.x + floorWidth;
                    }
                    if (floor2.pos.x <= -floorWidth) {
                        floor2.pos.x = floor1.pos.x + floorWidth;
                    }
                });

                donut.onCollide('milk', (milk) => {
                    score += 50;
                    scoreLabel.text = score;
                    destroy(milk);
                });

                donut.onCollide('knife', (knife) => {
                    score -= 50;
                    scoreLabel.text = score;
                    destroy(knife);
                });

                donut.onCollide('fork', () => {
                    addKaboom(donut.pos);
                    shake();
                    go('game-over', score);
                });
            });

            //Game Over Scenes
            scene('game-over', (score) => {
                const currentHighScore = getHighScore();
                if (score > currentHighScore) {
                    setHighScore(score);
                }

                //Game Over image
                const gameOver = add([
                    sprite('gameover', { width: width(), height: height() }),
                    anchor('center'),
                    pos(width() / 2, height() / 2),
                ]);

                const gameOverScore = add([
                    text('SCORE:' + ' ' + score, {
                        size: 50,
                        font: 'PixelFont',
                    }),
                    color(0, 0, 0),
                    pos(width() / 2, 50),
                    anchor('center'),
                ]);

                onKeyPress('space', () => {
                    go('game');
                });
            });
        }
        setGameStarted(true);
        go('game');
    }, [gameStarted]);

    return (
        <div>
            <canvas id="game"></canvas>
        </div>
    );
};

export default Game;
