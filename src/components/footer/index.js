import { library } from '@fortawesome/fontawesome-svg-core';
import { faMedium, faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Footer.module.css';
import React from 'react';

function Footer() {
    return (
        <div>
            <div className={styles.footer}>
                <ul className={styles.socials}>
                    <li>
                        <a className={styles.tw} href="https://twitter.com/DonutMeNFT" rel="noreferrer" target="_blank">
                            <FontAwesomeIcon icon={faTwitter} style={{ color: '#1DA1F2' }} />
                        </a>
                    </li>
                    <li>
                        <a className={styles.medium} href="https://donutme.medium.com" rel="noreferrer" target="_blank">
                            <FontAwesomeIcon icon={faMedium} style={{ color: '#292929' }} />
                        </a>
                    </li>
                    <li>
                        <a className={styles.dc} href='https://discord.gg/uAXqrA3d' rel="noreferrer" target="_blank">
                            <FontAwesomeIcon icon={faDiscord} style={{ color: '#5865F2' }} />
                        </a>
                    </li>
                </ul>
                <div className={styles.footerBottom}>
                    <p>
                        Created by
                        <span>
                            <a href="https://twitter.com/treanater1" target="_blank">
                                {' '}
                                Treanater
                            </a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
