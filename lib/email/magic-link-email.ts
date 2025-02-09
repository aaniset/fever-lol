const magicLinkTemplate = (
  link: string,
  action: "SIGNIN" | "ACTIVATE"
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link
      rel="preload"
      as="image"
      href="https://Fever.lol.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage.c4d45bf5.png&w=384&q=75"
    />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style="
      background-color: rgb(250, 251, 251);
      font-size: 1rem;
      line-height: 1.5rem;
      font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    "
  >
    <img
      alt="Fever.lol"
      height="50"
      src="https://www.fever.lol/logo.svg"
      style="
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        margin-bottom: 20px;
        display: block;
        outline: none;
        border: none;
        text-decoration: none;
      "
      width="auto"
    />
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        background-color: rgb(255, 255, 255);
        padding: 45px;
        max-width: 37.5em;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <h1
              style="
                text-align: center;
                margin-top: 0px;
                margin-bottom: 0px;
                line-height: 2rem;
              "
            >
              ${
                action === "SIGNIN"
                  ? "Login to Fever.lol"
                  : "Activate your account"
              }
            </h1>
            <p style="font-size: 1rem; line-height: 1.5rem; margin: 16px 0">
              Click the button below to log in to your Fever.lol account. This
              magic link will expire in 5 minutes.
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align: center; margin-top: 32px"
            >
              <tbody>
                <tr>
                  <td>
                    <a
                      href=${link}
                      style="
                        background-color: rgb(34, 80, 244);
                        color: rgb(255, 255, 255);
                        border-radius: 0.5rem;
                        padding: 12px 18px;
                        line-height: 100%;
                        text-decoration: none;
                        display: inline-block;
                        max-width: 100%;
                      "
                      target="_blank"
                      >Login to Fever.lol</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="
                font-size: 1rem;
                line-height: 1.5rem;
                margin: 16px 0;
                text-align: center;
              "
            >
              If the button doesn't work, you can also click on this link:
              <a
                href="${link}"
                style="color: rgb(34, 80, 244); text-decoration: underline"
                >here</a
              >
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-top: 32px"
            >
              <tbody>
                <tr>
                  <td>
                    <p
                      style="
                        font-size: 0.875rem;
                        line-height: 1.25rem;
                        margin: 16px 0;
                        text-align: center;
                        color: rgb(107, 114, 128);
                      "
                    >
                      If you didn't request this login link, you can safely
                      ignore this email.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="margin-top: 20px; max-width: 37.5em"
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <p
              style="
                text-align: center;
                color: rgb(156, 163, 175);
                margin-bottom: 45px;
                font-size: 14px;
                line-height: 24px;
                margin: 16px 0;
              "
            >
              Fever.lol, [Your Company Address]
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

export default magicLinkTemplate;
