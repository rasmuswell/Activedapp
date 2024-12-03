import React from "react";

export const Termsofservice = () => {
  return (
    <div className="text-gray-400">
      <h2 className="text-center mb-[20px] text-[2rem] text-white">
        Terms of Service
      </h2>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        1. Purpose
      </h2>
      <p>
        This application is intended for personal use to record and verify the
        activity of a user and their device. It is designed to provide proof of
        historic activity and ensure the authenticity of data when required for
        verification purposes.
      </p>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        2. Usage Guidelines
      </h2>
      <ul>
        <li>
          The app is for personal use only and is not designed or authorized for
          enterprise or corporate use.
        </li>
        <li>
          Users are prohibited from running this app in the background without
          the explicit knowledge and consent of the device's owner.
        </li>
        <li>
          The app is intended to demonstrate and verify activity; it is not to
          be used for proving inactivity.
        </li>
      </ul>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        3. Data Privacy
      </h2>
      <p>
        All data written to the blockchain is hashed using the SHA3-256 method
        to ensure that no personal or sensitive data is stored on-chain.
      </p>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        4. Costs
      </h2>
      <p>
        The app is free to download and use. However, users may incur blockchain
        network fees (e.g., burn fees) for sending data to the Minima network.
      </p>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        5. Disclaimer
      </h2>
      <ul>
        <li>
          This app is provided "as is" without any warranties, expressed or
          implied.
        </li>
        <li>
          The developers are not liable for any misuse of the app or the
          consequences thereof.
        </li>
      </ul>

      <h2 className="text-[1.25rem] font-semibold mt-[20px] text-white">
        6. Acceptance of Terms
      </h2>
      <p>
        By using this application, you agree to abide by these terms of service.
        Violation of these terms may result in restricted access to the
        application and/or legal consequences as applicable.
      </p>
      <p>
        This app is not meant to be used for enterprises. It’s not allowed to
        have this app run in the background without the user of the device
        knowing about it.
      </p>
    </div>
  );
};
