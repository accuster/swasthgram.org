import { BrowserRouter, Routes, Route } from "react-router-dom";
import SwasthgramHome from "./Pages/Home";
import SwasthManthan from "./Pages/SwasthManthan";
import Shudhvayu from "./Pages/Shudhvayu";
import Saksham from "./Pages/Saksham";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import FAQs from "./Pages/FAQs";
import RefundPolicy from "./Pages/RefundPolicy";
import ThankYouPage from "./Pages/ThankYou";
import DownloadPage from "./Pages/Download";
import AboutPage from "./Pages/AboutUs";
import CredentialsPage from "./Pages/Credentials";
import DonatePage from "./Pages/DonatePage";
import SocialPage from "./Pages/Social";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                       element={<SwasthgramHome />} />
        <Route path="/about"                  element={<AboutPage />} />
        <Route path="/programs/swasthmanthan" element={<SwasthManthan />} />
        <Route path="/programs/shudhvayu"     element={<Shudhvayu />} />
        <Route path="/programs/saksham"       element={<Saksham />} />
        <Route path="/privacy-policy"         element={<PrivacyPolicy />} />
        <Route path="/terms-of-service"       element={<TermsOfService />} />
        <Route path="/refund-policy"          element={<RefundPolicy />} />
        <Route path="/faqs"                   element={<FAQs />} />
        <Route path="/thank-you"              element={<ThankYouPage />} />
        <Route path="/download"               element={<DownloadPage />} />
        <Route path="/credentials"            element={<CredentialsPage />} />
        <Route path="/social"                 element={<SocialPage />} />
        <Route path="/donate"                 element={<DonatePage />} />
        <Route path="*"                       element={<SwasthgramHome />} />
      </Routes>
    </BrowserRouter>
  );
}