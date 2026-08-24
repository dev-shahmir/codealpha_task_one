/**
 * Shared wrapper for all transactional emails.
 * IMPORTANT: Every email clearly states this is a DEMO store —
 * no real money, products, or orders are involved.
 */
const baseTemplate = ({ title, bodyHtml, ctaText, ctaUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f2ef;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ef;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111111;padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;">URBANTHREAD</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#fff4e5;padding:12px 32px;text-align:center;border-bottom:1px solid #ffe1b3;">
              <span style="color:#8a5a00;font-size:12px;font-weight:600;letter-spacing:0.5px;">
                ⚠️ THIS IS A DEMO STORE — NO REAL PAYMENTS, ORDERS, OR PRODUCTS ARE INVOLVED. FOR DEMONSTRATION PURPOSES ONLY.
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;color:#1a1a1a;">
              ${bodyHtml}
              ${
                ctaUrl
                  ? `<div style="text-align:center;margin-top:28px;">
                      <a href="${ctaUrl}" style="background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;">${ctaText}</a>
                    </div>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#fafafa;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#999;font-size:11px;line-height:1.6;">
                UrbanThread Demo © ${new Date().getFullYear()} — A fictional brand built for portfolio/demo purposes.<br />
                This message was sent because a matching action occurred on the demo site. No real transaction took place.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = baseTemplate;
