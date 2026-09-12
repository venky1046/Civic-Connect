const wrap = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#F4F6F5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:24px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E4E9E7;">
          <tr>
            <td style="background:#0B2545;padding:20px 28px;">
              <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.2px;">Civic Connect</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 12px;color:#0B2545;font-size:20px;">${title}</h2>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#F7F9F8;color:#748280;font-size:12px;">
              Civic Connect &middot; Your Voice. Your City. Our Responsibility.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const row = (label, value) => `
  <tr>
    <td style="padding:4px 0;color:#748280;font-size:13px;width:170px;vertical-align:top;">${label}</td>
    <td style="padding:4px 0;color:#0B2545;font-size:13px;font-weight:600;">${value ?? '-'}</td>
  </tr>`;

function adminNewComplaintEmail(c) {
  const body = `
    <p style="color:#3A4644;font-size:14px;">A new civic complaint has been submitted and needs review.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">
      ${row('Complaint ID', c.complaintId)}
      ${row('Reported By', `${c.userName} (${c.userEmail})`)}
      ${row('Phone', c.userPhone)}
      ${row('Category', c.category)}
      ${row('Title', c.title)}
      ${row('Description', c.description)}
      ${row('Location', c.location)}
      ${row('Date/Time', c.dateTime)}
      ${row('Status', c.status)}
      ${row('Community Count', c.communityCount)}
      ${row('Priority', c.priority)}
    </table>`;
  return wrap(`New Civic Complaint &ndash; ${c.complaintId}`, body);
}

function userSubmissionEmail(c) {
  const body = `
    <p style="color:#3A4644;font-size:14px;">Hello ${c.userName},</p>
    <p style="color:#3A4644;font-size:14px;">Thank you for reporting a civic issue. Your complaint has been received.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">
      ${row('Complaint ID', c.complaintId)}
      ${row('Issue', c.title)}
      ${row('Location', c.location)}
      ${row('Date/Time', c.dateTime)}
      ${row('Status', c.status)}
    </table>
    <p style="color:#3A4644;font-size:14px;margin-top:16px;">You can track this complaint anytime using your Complaint ID on the <strong>Track Complaint</strong> page.</p>`;
  return wrap('Complaint Submitted Successfully', body);
}

function resolutionEmail(c) {
  const body = `
    <p style="color:#3A4644;font-size:14px;">Hello ${c.userName},</p>
    <p style="color:#3A4644;font-size:14px;">Good news! The civic issue you reported has been successfully resolved.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">
      ${row('Complaint ID', c.complaintId)}
      ${row('Issue', c.title)}
      ${row('Location', c.location)}
      ${row('Status', 'RESOLVED')}
      ${row('Admin Remarks', c.adminRemark || 'No additional remarks')}
    </table>
    <p style="color:#3A4644;font-size:14px;margin-top:16px;">Thank you for helping improve our community.</p>`;
  return wrap('Your Complaint Has Been Resolved', body);
}

module.exports = { adminNewComplaintEmail, userSubmissionEmail, resolutionEmail };
