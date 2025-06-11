import styles from "./footer.module.css";

const Footer = () => {
    return(
        <div className={styles.container}>
            <div className="footerText">
                <p>
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
            
        </div>
    )
};

export default Footer;