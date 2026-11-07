import { useEffect, useRef } from "react";

// Zoho Campaigns web opt-in form, embedded as a PLAIN native HTML form —
// no Zoho JS loaded. Their own minified client script (optin.min.js) tries
// to open a popup window before submitting and crashes with
// "Cannot read properties of null (reading 'document')" when that popup is
// blocked (silently killing the Subscribe button for the user). A plain
// POST with target="_zcSignup" is handled natively by the browser (it just
// opens a new tab), which Zoho's server processes the same way regardless
// of client JS — so we skip their fragile script entirely and only keep a
// small inline validation check of our own. IDs/names/hidden values below
// must stay exact — Zoho's form processing keys off them.
const FORM_ID = "sf3z3a670cdce326df847f602963e8c25512e6a557189ca68d4db175047ec38fc526";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORM_HTML = `
<div id="${FORM_ID}" data-type="signupform" style="opacity: 1;">
	<div id="customForm">
		<div class="quick_form_8_css" style="background-color: transparent; width: 100%; max-width: 420px; z-index: 2; font-family: 'Inter', sans-serif; border-width: 0; border-style: solid; border-color: #E8E4DC; border-radius: 0; overflow: visible" name="SIGNUP_BODY">
			<div>
				<form method="POST" id="zcampaignOptinForm" style="margin: 0px; width: 100%" action="https://rozfeu-zinc.maillist-manage.com/weboptin.zc" target="_zcSignup" siq_id="autopick_fy4ryk31u8">
					<div style="background-color: rgb(255, 235, 232); padding: 10px; color: rgb(210, 0, 0); font-size: 12px; margin: 0 0 10px; border: 1px solid rgb(255, 217, 211); opacity: 1; display: none" id="errorMsgDiv">Please enter a valid email address.</div>
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
  const wrapRef = useRef(null);

  useEffect(() => {
    const form = wrapRef.current?.querySelector("#zcampaignOptinForm");
    if (!form) return;

    const emailInput = form.querySelector("#EMBED_FORM_EMAIL_LABEL");
    const errorDiv = form.querySelector("#errorMsgDiv");

    function onSubmit(e) {
      if (!EMAIL_RE.test(emailInput.value.trim())) {
        e.preventDefault();
        errorDiv.style.display = "block";
        emailInput.focus();
        return;
      }
      errorDiv.style.display = "none";
    }

    function onInput() {
      if (errorDiv.style.display !== "none") errorDiv.style.display = "none";
    }

    form.addEventListener("submit", onSubmit);
    emailInput.addEventListener("input", onInput);
    return () => {
      form.removeEventListener("submit", onSubmit);
      emailInput.removeEventListener("input", onInput);
    };
  }, []);

  return (
    <>
      <style>{`
        .quick_form_8_css * { -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important; overflow-wrap: break-word }
        .quick_form_8_css input[type="submit"]:hover { background-color: #145A2F !important; }
      `}</style>
      <div ref={wrapRef} dangerouslySetInnerHTML={{ __html: FORM_HTML }} />
    </>
  );
}
