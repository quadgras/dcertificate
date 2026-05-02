import styles from "./styles/home.module.css";
import RootNavigaion from "../components/root_navigation";
import logo from "../assets/logo.png";

export default function Home() {
  return <>
    <header>
      <img src={logo} height="250px" />
      <h1>DCERTIFICATE</h1>
      <p>
        Web application for 
        issuing, approving and recieving
        digital certificates.
      </p>
    </header>
    <article className={styles.about}>
      <h1>Usecases</h1>
      <div className={styles.infoLayout}>
        <h2>Issuers & Approvers</h2>
        <p>
          Individuals and organizations
          can create issuer-accounts to
          launch and approve certifications.
        </p>

        <h2>Recepients</h2>
        <p>
          Individuals and organizations
          can create recepient-account to
          receive certificates from issuers.
        </p>

        <h2>Third Parties</h2>
        <p>
          Third parties (including those that
          don't have account on this platform)
          like employers, educational institutions, etc.
          can view and verify certificates
          given by a recepient entity.
        </p>
      </div>
    </article>
    <footer>
      &copy;2026, Abhijeet Verma
      <br />
      This is an educational project.
      The <a href="https://github.com/quadgras/dcertificate">source code</a> is
      available on Github
      under terms of MIT Licence.
    </footer>
    <RootNavigaion />
  </>;
}
