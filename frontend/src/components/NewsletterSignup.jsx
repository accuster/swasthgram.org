import { useEffect } from "react";

// Zoho Campaigns web opt-in form. Script tags inside dangerouslySetInnerHTML
// don't execute in React, so the loader script + setupSF() call are handled
// here manually instead. IDs/names/hidden values below must stay exact —
// Zoho's form processing keys off them. Only cosmetic styling (fonts, colors,
// radii, layout) was changed from Zoho's default — the submission logic
// (script + setupSF + popup/overlay markup) matches their original embed.
const FORM_ID = "sf3z3a670cdce326df847f602963e8c25512e6a557189ca68d4db175047ec38fc526";
const SCRIPT_ID = "zoho-optin-script";
const SCRIPT_SRC = "https://rozfeu-zinc.maillist-manage.com/js/optin.min.js";
const REF_IMG_SRC = "https://rozfeu-zinc.maillist-manage.com/images/spacer.gif";

const FORM_HTML = `
<div id="${FORM_ID}" data-type="signupform" style="opacity: 1;">
	<div id="customForm">
		<div class="quick_form_8_css" style="background-color: transparent; width: 100%; max-width: 420px; z-index: 2; font-family: 'Inter', sans-serif; border-width: 0; border-style: solid; border-color: #E8E4DC; border-radius: 0; overflow: visible" name="SIGNUP_BODY">
			<div>
				<div style="display:none" id="SIGNUP_HEADING">Join Our Newsletter</div>
				<div style="position:relative;">
					<div id="Zc_SignupSuccess" style="display:none;position:absolute;margin-left:4%;width:90%;background-color: white; padding: 3px; border: 3px solid rgb(194, 225, 154);  margin-top: 10px;margin-bottom:10px;word-break:break-all">
						<table width="100%" cellpadding="0" cellspacing="0" border="0">
							<tbody>
								<tr>
									<td width="10%">
										<img class="successicon" src="https://rozfeu-zinc.maillist-manage.com/images/challangeiconenable.jpg" align="absmiddle">
									</td>
									<td>
										<span id="signupSuccessMsg" style="color: rgb(73, 140, 132); font-family: sans-serif; font-size: 14px;word-break:break-word">&nbsp;&nbsp;Thank you for Signing Up</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<form method="POST" id="zcampaignOptinForm" style="margin: 0px; width: 100%" action="https://rozfeu-zinc.maillist-manage.com/weboptin.zc" target="_zcSignup" siq_id="autopick_3um6rph4us">
					<div style="background-color: rgb(255, 235, 232); padding: 10px; color: rgb(210, 0, 0); font-size: 11px; margin: 0 0 10px; border: 1px solid rgb(255, 217, 211); opacity: 1; display: none" id="errorMsgDiv">Please correct the marked field(s) below.</div>
					<div style="position: relative; margin: 0 0 12px; width: 100%; height: 48px; display: block" class="SIGNUP_FLD">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);z-index:5;pointer-events:none"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6"/><path d="M2 6h20v12H2z"/></svg>
						<input type="text" style="font-size: 14px; border: 1.5px solid #E8E4DC; border-radius: 10px; width: 100%; height: 100%; z-index: 4; outline: none; padding: 5px 16px 5px 42px; color: #1F2937; text-align: left; font-family: 'Inter', sans-serif; background-color: #FFFFFF; box-sizing: border-box" placeholder="Your email address" changeitem="SIGNUP_FORM_FIELD" name="CONTACT_EMAIL" id="EMBED_FORM_EMAIL_LABEL">
					</div>
					<div style="position: relative; margin: 0; width: 100%; height: 50px; text-align: left; display: block" class="SIGNUP_FLD">
						<input type="button" style="text-align: center; border-radius: 10px; width: 100%; height: 100%; z-index: 5; border: 0px; color: rgb(255, 255, 255); cursor: pointer; outline: medium; font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 700; background-color: #1B6B3A; margin: 0" name="SIGNUP_SUBMIT_BUTTON" id="zcWebOptin" value="Subscribe">
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
	<img id="refImage" onload="referenceSetter(this)" style="display:none;">
</div>
<input type="hidden" id="signupFormType" value="QuickForm_Horizontal">
<div id="zcOptinOverLay" oncontextmenu="return false" style="display:none;text-align: center; background-color: rgb(0, 0, 0); opacity: 0.5; z-index: 100; position: fixed; width: 100%; top: 0px; left: 0px; height: 988px;"></div>
<div id="zcOptinSuccessPopup" style="display:none;z-index: 9999;width: 800px; height: 40%;top: 84px;position: fixed; left: 26%;background-color: #FFFFFF;border-color: #E6E6E6; border-style: solid; border-width: 1px;  box-shadow: 0 1px 10px #424242;padding: 35px;">
	<span style="position: absolute;top: -16px;right:-14px;z-index:99999;cursor: pointer;" id="closeSuccess">
		<img src="https://rozfeu-zinc.maillist-manage.com/images/videoclose.png">
	</span>
	<div id="zcOptinSuccessPanel"></div>
</div>
`;

export default function NewsletterSignup() {
  useEffect(() => {
    window[`runOnFormSubmit_${FORM_ID}`] = function () {
      /* Before submit hook, kept for parity with Zoho's embed. */
    };

    // Placeholder so the tracking pixel's inline onload never throws if it
    // fires before optin.min.js has defined its own referenceSetter — Zoho's
    // script sets this up asynchronously, after its own script.onload event.
    if (typeof window.referenceSetter !== "function") {
      window.referenceSetter = function () {};
    }

    function initForm() {
      if (window.setupSF) {
        window.setupSF(FORM_ID, "ZCFORMVIEW", false, "light", false, "0");
      }
      // Only assign the tracking pixel's src once optin.min.js has fully
      // executed (and defined window.referenceSetter) — this image is part
      // of the raw embedded HTML, so if its src were set immediately on
      // mount it could load and fire onload before the script finishes
      // loading, throwing a ReferenceError that silently breaks Zoho's init.
      const refImg = document.getElementById("refImage");
      if (refImg) refImg.src = REF_IMG_SRC;
    }

    if (document.getElementById(SCRIPT_ID)) {
      initForm();
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = initForm;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <style>{`
        .quick_form_8_css * { -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important; overflow-wrap: break-word }
        .quick_form_8_css input[type="button"]:hover { background-color: #145A2F !important; }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: FORM_HTML }} />
    </>
  );
}
