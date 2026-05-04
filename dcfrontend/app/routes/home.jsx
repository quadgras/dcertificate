import styles from "./styles/home.module.css";
import RootNavigaion from "../components/root_navigation";
import DcertificateLogo from "../components/logo";
import DetailList from "../components/detail_list";

export default function Home() {
  return <>
    <header className={styles.title_content}>
      <DcertificateLogo />
      <h1>DCERTIFICATE</h1>
      <p>
        Web application for
        issuing, approving and receiving
        digital certificates.
      </p>
    </header>
    <div className={styles.about}>
      <DetailList content={[
        [
          <h2>Issuers & Approvers</h2>,
          `Individuals and organizations
            can create issuer-accounts to
            launch and approve certifications.`
        ],
        [
          <h2>Recipients</h2>,
          `Individuals and organizations
            can create recipient-account to
            receive certificates from issuers.`
        ],
        [
          <h2>Third Parties</h2>,
          `Third parties (including those that
            don't have account on this platform)
            like employers, educational institutions, etc.
            can view and verify certificates
            given by a recepient entity.`
        ]
      ]} />

      <p>This is an educational project.
      The <a href="https://github.com/quadgras/dcertificate">source code</a> is
      available on Github
      under terms of MIT Licence.</p>
    </div>
    <footer>
      &copy;2026, Abhijeet Verma
    </footer>
    <RootNavigaion />
  </>;
}
