import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RAZORPAY_LINK = "https://razorpay.me/@swasthgram";

export default function DonateShudhvayu() {
  useEffect(() => {
    document.title = "Gift Delhi Clean Air | Shudhvayu by Swasthgram";
  }, []);

  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root{--navy:#102b4b;--blue:#2366b1;--sky:#eaf4ff;--cream:#faf8f2;--muted:#617186;--line:#dce5ee}
        .shudhvayu-donate *{box-sizing:border-box}
        .shudhvayu-donate{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial;color:var(--navy);background:#fff}
        .shudhvayu-donate a{color:inherit;text-decoration:none}
        .shudhvayu-donate .wrap{max-width:1160px;margin:auto;padding:0 24px}
        .shudhvayu-donate .btn{border:0;border-radius:10px;padding:15px 22px;background:var(--blue);color:white;font-weight:750;cursor:pointer;display:inline-block;text-align:center}
        .shudhvayu-donate .btn:hover{background:#164f91}
        .shudhvayu-donate .btn.outline{background:white;color:var(--blue);border:1px solid #bdd3eb}
        .shudhvayu-donate .hero{background:linear-gradient(120deg,#f5f9fe 0%,#fff 60%,#f7f4eb 100%);padding:132px 0 82px}
        .shudhvayu-donate .hero-grid{display:grid;grid-template-columns:1.06fr .94fr;align-items:center;gap:58px}
        .shudhvayu-donate .eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);font-weight:800}
        .shudhvayu-donate h1{font-size:clamp(42px,5.1vw,70px);line-height:1.07;letter-spacing:-2.8px;margin:20px 0}
        .shudhvayu-donate h1 em{font-style:normal;color:var(--blue)}
        .shudhvayu-donate .lead{font-size:18px;line-height:1.75;color:#52657a;max-width:580px}
        .shudhvayu-donate .actions{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0}
        .shudhvayu-donate .proof{font-size:13px;color:#63758a}
        .shudhvayu-donate .visual{min-height:420px;position:relative;border-radius:22px;overflow:hidden;background:linear-gradient(155deg,#b8d5ee,#f0f6fa 58%,#d2dce3);box-shadow:0 20px 65px #143d6320}
        .shudhvayu-donate .visual:before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#0b315680,transparent 45%)}
        .shudhvayu-donate .visual img{width:100%;height:100%;position:absolute;object-fit:cover}
        .shudhvayu-donate .visual-caption{position:absolute;bottom:24px;left:24px;right:24px;background:#ffffffed;padding:20px;border-radius:12px;font-weight:750}
        .shudhvayu-donate .placeholder{position:absolute;top:43%;width:100%;text-align:center;font-size:62px}
        .shudhvayu-donate .placeholder small{display:block;font-size:15px;margin-top:12px;color:#345}
        .shudhvayu-donate .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:-35px;position:relative}
        .shudhvayu-donate .stat{background:white;padding:24px;border:1px solid var(--line);border-radius:14px;box-shadow:0 8px 26px #153e6310}
        .shudhvayu-donate .stat strong{display:block;font-size:23px;margin-bottom:5px}
        .shudhvayu-donate .stat span{font-size:13px;color:var(--muted)}
        .shudhvayu-donate section{padding:88px 0}
        .shudhvayu-donate .section-heading{text-align:center;max-width:700px;margin:0 auto 45px}
        .shudhvayu-donate h2{font-size:clamp(30px,3.3vw,44px);letter-spacing:-1.4px;line-height:1.2;margin:12px 0}
        .shudhvayu-donate .section-heading p,.shudhvayu-donate .bodycopy{color:var(--muted);line-height:1.8}
        .shudhvayu-donate .three{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .shudhvayu-donate .tile{padding:28px;border:1px solid var(--line);border-radius:16px;background:#fff}
        .shudhvayu-donate .tile .num{font-size:14px;font-weight:800;color:var(--blue)}
        .shudhvayu-donate .tile h3{font-size:20px;margin:15px 0 9px}
        .shudhvayu-donate .tile p{line-height:1.7;color:var(--muted);font-size:14px}
        .shudhvayu-donate .soft{background:var(--cream)}
        .shudhvayu-donate .donate-section{background:#f1f6fc}
        .shudhvayu-donate .donate-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:65px;align-items:start}
        .shudhvayu-donate .donate-copy h2{font-size:48px}
        .shudhvayu-donate .check{padding:12px 0;border-bottom:1px solid #d9e5ef;color:#38516b}
        .shudhvayu-donate .formcard{background:white;border:1px solid #d7e3ee;box-shadow:0 22px 60px #17466c14;border-radius:18px;padding:32px}
        .shudhvayu-donate .formcard h3{margin:0 0 8px;font-size:24px}
        .shudhvayu-donate .formcard p{color:var(--muted);font-size:14px;line-height:1.6}
        .shudhvayu-donate .amounts{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:22px 0}
        .shudhvayu-donate .amount{background:#fff;border:1.5px solid #d6e2ed;border-radius:11px;padding:17px;cursor:pointer;text-align:left;color:var(--navy);font-size:21px;font-weight:800}
        .shudhvayu-donate .amount small{display:block;font-size:11px;color:#728399;font-weight:500;margin-top:5px}
        .shudhvayu-donate .amount.active{background:#edf5ff;border-color:var(--blue)}
        .shudhvayu-donate .fine{font-size:12px!important;text-align:center}
        .shudhvayu-donate .faq{max-width:760px;margin:auto}
        .shudhvayu-donate details{border-bottom:1px solid var(--line);padding:19px 0}
        .shudhvayu-donate summary{font-weight:700;cursor:pointer}
        .shudhvayu-donate details p{color:var(--muted);line-height:1.7}
        .shudhvayu-donate .video-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
        .shudhvayu-donate .video-card{overflow:hidden;background:white;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px #1234560c}
        .shudhvayu-donate .video-thumb{display:block;position:relative;aspect-ratio:16/9;overflow:hidden;background:#dce9f4}
        .shudhvayu-donate .video-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .2s}
        .shudhvayu-donate .video-thumb:hover img{transform:scale(1.035)}
        .shudhvayu-donate .play-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#d92626;color:white;border-radius:15px;padding:12px 21px;font-size:25px;line-height:1;box-shadow:0 6px 25px #0005}
        .shudhvayu-donate .video-info{padding:22px}
        .shudhvayu-donate .video-info h3{font-size:19px;margin:0 0 9px}
        .shudhvayu-donate .video-info p{font-size:14px;color:var(--muted);line-height:1.6;margin:0 0 12px}
        .shudhvayu-donate .video-info a{color:var(--blue);font-size:14px;font-weight:700}
        @media(max-width:800px){
          .shudhvayu-donate .hero-grid,.shudhvayu-donate .donate-grid{grid-template-columns:1fr;gap:35px}
          .shudhvayu-donate .hero{padding:105px 0 65px}
          .shudhvayu-donate .visual{min-height:320px}
          .shudhvayu-donate .stats,.shudhvayu-donate .three{grid-template-columns:1fr}
          .shudhvayu-donate .stats{margin-top:20px}
          .shudhvayu-donate section{padding:58px 0}
          .shudhvayu-donate .donate-copy h2{font-size:36px}
          .shudhvayu-donate h1{letter-spacing:-1.8px}
          .shudhvayu-donate .formcard{padding:22px}
        }
        @media(max-width:700px){
          .shudhvayu-donate .video-grid{grid-template-columns:1fr}
        }
      `}</style>

      <Header />

      <div className="shudhvayu-donate">
        <main>
          <div className="hero">
            <div className="wrap hero-grid">
              <div>
                <div className="eyebrow">SHUDHVAYU · THE CLEAN AIR MISSION</div>
                <h1>Gift Delhi the air it <em>deserves to breathe.</em></h1>
                <p className="lead">Clean air should never be a privilege. Help put patented, electricity-free air filters on everyday vehicles, turning ordinary journeys into a community-powered clean-air movement.</p>
                <div className="actions">
                  <a className="btn" href="#donate">Sponsor clean air →</a>
                  <a className="btn outline" href="#how">See how it works</a>
                </div>
                <p className="proof">An initiative of Swasthgram · Patented technology · Delhi NCR</p>
              </div>
              <div className="visual">
                <div className="placeholder">🚙<small>Replace with your Shudhvayu-on-car photograph</small></div>
                <div className="visual-caption">Every vehicle can become part of the solution.</div>
              </div>
            </div>
          </div>

          <div className="wrap stats">
            <div className="stat"><strong>Zero electricity</strong><span>Passive filtration while vehicles move</span></div>
            <div className="stat"><strong>Free installation</strong><span>Donations fund filters for participating drivers</span></div>
            <div className="stat"><strong>Patented innovation</strong><span>Designed to help tackle urban air pollution</span></div>
          </div>

          <section id="how">
            <div className="wrap">
              <div className="section-heading">
                <div className="eyebrow">THE IDEA</div>
                <h2>Turn daily traffic into collective action.</h2>
                <p>Shudhvayu uses airflow around moving vehicles to support particulate filtration without an external power supply.</p>
              </div>
              <div className="three">
                <div className="tile">
                  <div className="num">01 / YOU GIVE</div>
                  <h3>Fund a filter</h3>
                  <p>Your contribution supports production, installation and rollout of Shudhvayu systems.</p>
                </div>
                <div className="tile">
                  <div className="num">02 / WE DEPLOY</div>
                  <h3>Equip a vehicle</h3>
                  <p>Our team coordinates installation on participating vehicles, with no filter purchase cost for the driver.</p>
                </div>
                <div className="tile">
                  <div className="num">03 / THE CITY BENEFITS</div>
                  <h3>Clean air in motion</h3>
                  <p>As equipped vehicles travel, passive filtration operates along their routes. Impact depends on deployment and real-world conditions.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="videos" className="soft">
            <div className="wrap">
              <div className="section-heading">
                <div className="eyebrow">WATCH SHUDHVAYU IN ACTION</div>
                <h2>See the innovation. Understand the mission.</h2>
                <p>Explore the installation demonstration, the Shudhvayu concept, an interview on Sansad TV and an efficacy demonstration. Tap any thumbnail to watch the original video on YouTube.</p>
              </div>
              <div className="video-grid">
                <article className="video-card">
                  <a className="video-thumb" href="https://youtu.be/4LNZPUZ-pH4" target="_blank" rel="noopener noreferrer" aria-label="Watch 60-second Shudhvayu installation video">
                    <img src="https://i.ytimg.com/vi/4LNZPUZ-pH4/hqdefault.jpg" alt="Thumbnail for Shudhvayu 60-second vehicle installation demonstration" loading="lazy" />
                    <span className="play-icon" aria-hidden="true">▶</span>
                  </a>
                  <div className="video-info">
                    <h3>Convert a vehicle into an air purifier in 60 seconds</h3>
                    <p>Watch the Shudhvayu installation demonstration.</p>
                    <a href="https://youtu.be/4LNZPUZ-pH4" target="_blank" rel="noopener noreferrer">Watch installation video ↗</a>
                  </div>
                </article>
                <article className="video-card">
                  <a className="video-thumb" href="https://youtu.be/LLvO7ruExrI" target="_blank" rel="noopener noreferrer" aria-label="Watch Shudhvayu concept video">
                    <img src="https://i.ytimg.com/vi/LLvO7ruExrI/hqdefault.jpg" alt="Thumbnail for Shudhvayu concept video" loading="lazy" />
                    <span className="play-icon" aria-hidden="true">▶</span>
                  </a>
                  <div className="video-info">
                    <h3>Shudhvayu: The concept</h3>
                    <p>Discover the idea behind vehicle-mounted air filtration.</p>
                    <a href="https://youtu.be/LLvO7ruExrI" target="_blank" rel="noopener noreferrer">Watch concept video ↗</a>
                  </div>
                </article>
                <article className="video-card">
                  <a className="video-thumb" href="https://www.youtube.com/watch?v=CvDWJTjQdmY" target="_blank" rel="noopener noreferrer" aria-label="Watch Sansad TV interview about Shudhvayu">
                    <img src="https://i.ytimg.com/vi/CvDWJTjQdmY/hqdefault.jpg" alt="Thumbnail for Sansad TV interview about Shudhvayu" loading="lazy" />
                    <span className="play-icon" aria-hidden="true">▶</span>
                  </a>
                  <div className="video-info">
                    <h3>Shudhvayu on Sansad TV</h3>
                    <p>Watch the television interview discussing the innovation and its mission.</p>
                    <a href="https://www.youtube.com/watch?v=CvDWJTjQdmY" target="_blank" rel="noopener noreferrer">Watch interview ↗</a>
                  </div>
                </article>
                <article className="video-card">
                  <a className="video-thumb" href="https://www.youtube.com/watch?v=-qBV1EKd2s0" target="_blank" rel="noopener noreferrer" aria-label="Watch Shudhvayu efficacy demonstration">
                    <img src="https://i.ytimg.com/vi/-qBV1EKd2s0/hqdefault.jpg" alt="Thumbnail for Shudhvayu efficacy demonstration reporting PM2.5 from 450 to 001" loading="lazy" />
                    <span className="play-icon" aria-hidden="true">▶</span>
                  </a>
                  <div className="video-info">
                    <h3>Efficacy demonstration: PM2.5 reading 450 to 001</h3>
                    <p>View the reported demonstration. The displayed readings are demonstration-specific and do not establish citywide air-quality outcomes.</p>
                    <a href="https://www.youtube.com/watch?v=-qBV1EKd2s0" target="_blank" rel="noopener noreferrer">Watch efficacy video ↗</a>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="soft">
            <div className="wrap section-heading">
              <div className="eyebrow">A DIWALI GIFT THAT LASTS</div>
              <h2>Let the lights shine. Let Delhi breathe.</h2>
              <p>Celebrate by supporting cleaner air for children, families, commuters and communities. Sponsor a vehicle in honour of someone you love.</p>
              <a href="#donate" className="btn">Make your gift</a>
            </div>
          </section>

          <section id="donate" className="donate-section">
            <div className="wrap donate-grid">
              <div className="donate-copy">
                <div className="eyebrow">DONATE TO SHUDHVAYU</div>
                <h2>Your contribution puts clean air in motion.</h2>
                <p className="bodycopy">Help fund Shudhvayu filters, free installations and programme operations in Delhi NCR. Sponsor a vehicle with a ₹10,000 contribution through Swasthgram's secure Razorpay payment page.</p>
                <div className="check">✓ Dedicated Shudhvayu mission contribution</div>
                <div className="check">✓ Secure checkout via Razorpay</div>
                <div className="check">✓ Donation receipt after verified payment</div>
                <div className="check">✓ Indian tax benefits subject to eligibility and applicable law</div>
              </div>
              <div className="formcard">
                <h3>Make a donation</h3>
                <p>Complete your ₹10,000 contribution securely on Razorpay.</p>
                <div className="amounts" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="amount active" style={{ cursor: "default" }}>
                    ₹10,000<small>Shudhvayu vehicle sponsorship contribution</small>
                  </div>
                </div>
                <a className="btn submit" href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                  Donate securely via Razorpay →
                </a>
                <p className="fine">You will be redirected to Swasthgram's Razorpay payment page to complete your donation.</p>
                <p className="fine">For other donation amounts, please contact <a href="mailto:support@swasthgram.org">support@swasthgram.org</a> for a suitable payment link.</p>
                <p className="fine">*Please confirm the actual per-vehicle sponsorship cost before publishing this claim.</p>
              </div>
            </div>
          </section>

          <section id="faq">
            <div className="wrap">
              <div className="section-heading">
                <div className="eyebrow">YOUR QUESTIONS</div>
                <h2>Good to know before giving.</h2>
              </div>
              <div className="faq">
                <details>
                  <summary>How does Shudhvayu work?</summary>
                  <p>It is a passive, vehicle-mounted air-filtration system that uses airflow during travel and does not require electricity.</p>
                </details>
                <details>
                  <summary>Where will my donation go?</summary>
                  <p>Donations designated for Shudhvayu support filter production, installation and related programme delivery.</p>
                </details>
                <details>
                  <summary>Will I receive a receipt?</summary>
                  <p>A donation receipt can be issued once payment is verified. Tax-deduction eligibility depends on the recipient entity and applicable law.</p>
                </details>
                <details>
                  <summary>Can I sponsor a vehicle in someone's honour?</summary>
                  <p>Yes. Contact support@swasthgram.org to discuss a dedication or fleet sponsorship.</p>
                </details>
                <details>
                  <summary>Can I donate from outside India?</summary>
                  <p>This INR Razorpay form is intended for eligible India donations. For US giving, please visit the Swasthgram donation portal to select the appropriate donor region.</p>
                </details>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
