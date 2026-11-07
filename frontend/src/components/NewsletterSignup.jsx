import { useEffect } from "react";

// Zoho Campaigns web opt-in form, submitted as a plain native form POST
// instead of through Zoho's optin.min.js. That script is hosted on a
// third-party marketing domain (maillist-manage.com) that's blocked by
// default by a growing share of browsers' built-in tracking protection
// (Firefox strict/private mode, Brave Shields, Safari ITP, Edge tracking
// prevention) — when it's blocked, window.setupSF never gets defined, so
// the Subscribe button (a plain <input type="button">) never gets a click
// handler and silently does nothing. A native form submit has no such
// dependency. The action URL, method, target and every hidden field below
// are unchanged from Zoho's own embed — only the client-side trigger
// (JS click handler vs. native submit) is different, so Zoho's server
// receives and processes the exact same data either way.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORM_HTML = `
<div id="sf3z3a670cdce326df847f602963e8c25512e6a557189ca68d4db175047ec38fc526" data-type="signupform" style="opacity: 1;">
	<div id="customForm">
		<div class="quick_form_8_css" style="background-color: transparent; width: 100%; max-width: 420px; z-index: 2; font-family: 'Inter', sans-serif; border-width: 0; border-style: solid; border-color: #E8E4DC; border-radius: 0; overflow: visible" name="SIGNUP_BODY">
			<div>
				<div style="display:none" id="SIGNUP_HEADING">Join Our Newsletter</div>
				<form method="POST" id="zcampaignOptinForm" style="margin: 0px; width: 100%" action="https://rozfeu-zinc.maillist-manage.com/weboptin.zc" target="_zcSignup" siq_id="autopick_3um6rph4us">
					<div style="background-color: rgb(255, 235, 232); padding: 10px; color: rgb(210, 0, 0); font-size: 11px; margin: 0 0 10px; border: 1px solid rgb(255, 217, 211); opacity: 1; display: none" id="errorMsgDiv">Please enter a valid email address.</div>
					<div style="position: relative; margin: 0 0 12px; width: 100%; height: 48px; display: block" class="SIGNUP_FLD">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);z-index:5;pointer-events:none"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6"/><path d="M2 6h20v12H2z"/></svg>
						<input type="text" style="font-size: 14px; border: 1.5px solid #E8E4DC; border-radius: 10px; width: 100%; height: 100%; z-index: 4; outline: none; padding: 5px 16px 5px 42px; color: #1F2937; text-align: left; font-family: 'Inter', sans-serif; background-color: #FFFFFF; box-sizing: border-box" placeholder="Your email address" changeitem="SIGNUP_FORM_FIELD" name="CONTACT_EMAIL" id="EMBED_FORM_EMAIL_LABEL">
					</div>
					<div style="position: relative; margin: 0; width: 100%; height: 50px; text-align: left; display: block" class="SIGNUP_FLD">
						<input type="submit" style="text-align: center; border-radius: 10px; width: 100%; height: 100%; z-index: 5; border: 0px; color: rgb(255, 255, 255); cursor: pointer; outline: medium; font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 700; background-color: #1B6B3A; margin: 0" name="SIGNUP_SUBMIT_BUTTON" id="zcWebOptin" value="Subscribe">
					</div>
					<input type="hidden" id="fieldBorder" value="">
					<input type="hidden" id="submitType" name="submitType" value="optinCustomView">
					<input type="hidden" id="emailReportId" name="emailReportId" value="">
					<input type="hidden" id="formType" name="formType" value="QuickForm">
					<input type="hidden" name="zx" id="cmpZuid" value="1257691fe">
					<input type="hidden" name="zcvers" value="3.0">
					<input type="hidden" name="oldListIds" id="allCheckedListIds" value="">
					<input type="hidden" id="mode" name="mode" value="OptinCreateView">
					<input type="hidden" id="zcld" name="zcld" value="">
					<input type="hidden" id="zctd" name="zctd" value="14bb915715300031">
					<input type="hidden" id="document_domain" value="">
					<input type="hidden" id="zc_Url" value="rozfeu-zinc.maillist-manage.com">
					<input type="hidden" id="new_optin_response_in" value="0">
					<input type="hidden" id="duplicate_optin_response_in" value="0">
					<input type="hidden" name="zc_trackCode" id="zc_trackCode" value="ZCFORMVIEW">
					<input type="hidden" id="zc_formIx" name="zc_formIx" value="3z3a670cdce326df847f602963e8c25512e6a557189ca68d4db175047ec38fc526">
					<input type="hidden" id="viewFrom" value="URL_ACTION">
					<span style="display: none" id="dt_CONTACT_EMAIL">1,true,6,Contact Email,2</span>
				</form>
			</div>
		</div>
	</div>
</div>
`;

export default function NewsletterSignup() {
  useEffect(() => {
    const form = document.getElementById("zcampaignOptinForm");
    if (!form) return;

    function handleSubmit(e) {
      const emailInput = document.getElementById("EMBED_FORM_EMAIL_LABEL");
      const errorDiv = document.getElementById("errorMsgDiv");
      const valid = emailInput && EMAIL_RE.test(emailInput.value.trim());
      if (errorDiv) errorDiv.style.display = valid ? "none" : "block";
      if (!valid) e.preventDefault();
    }

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <>
      <style>{`
        .quick_form_8_css * { -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important; overflow-wrap: break-word }
        .quick_form_8_css input[type="submit"]:hover { background-color: #145A2F !important; }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: FORM_HTML }} />
    </>
  );
}
