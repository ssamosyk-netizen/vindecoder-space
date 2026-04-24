import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="container">
      <Head>
        <title>Privacy Policy | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
      </div>

      <main className="content">
        <h2>Privacy Policy for VIN DECODER</h2>
        <p>Last updated: April 2026</p>

        <p>At VIN DECODER, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by VIN DECODER and how we use it.</p>

        <h3>Log Files</h3>
        <p>VIN DECODER follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

        <h3>Cookies and Web Beacons</h3>
        <p>Like any other website, VIN DECODER uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

        <h3>Google DoubleClick DART Cookie</h3>
        <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">https://policies.google.com/technologies/ads</a></p>

        <h3>Advertising Partners Privacy Policies</h3>
        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on VIN DECODER, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
        <p>Note that VIN DECODER has no access to or control over these cookies that are used by third-party advertisers.</p>

        <h3>Consent</h3>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>

        <button className="back-btn" onClick={() => router.push('/')}>← Back to Home</button>
      </main>

      <footer className="footer"><p>© 2026 VIN DECODER</p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #ccc; font-family: sans-serif; line-height: 1.6; margin: 0; padding: 0;}
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
        .header { text-align: center; margin-bottom: 40px; width: 100%; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        
        .content { max-width: 800px; width: 100%; background: #0a0a0a; border: 1px solid #222; padding: 40px; border-radius: 15px; }
        .content h2 { color: #fff; margin-top: 0; }
        .content h3 { color: #facc15; margin-top: 30px; font-size: 1.2rem; }
        .content p { margin-bottom: 15px; font-size: 0.95rem; }
        .content a { color: #facc15; text-decoration: none; }
        .content a:hover { text-decoration: underline; }
        
        .back-btn { background: #facc15; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 30px; transition: 0.2s; }
        .back-btn:hover { background: #fff; }
        
        .footer { text-align: center; margin-top: 60px; color: #222; font-size: 11px; }
        
        @media (max-width: 600px) {
          .content { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
