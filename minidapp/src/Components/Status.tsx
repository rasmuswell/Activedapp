import React, { useContext, useEffect } from "react";
import { appContext } from "../AppContext";
import { listenPendingTxn } from "../services/minima";

export const Status = ({ set, msg }) => {
  const { setBlockChainStatus, pendingUid } = useContext(appContext);

  useEffect(() => {
    if (pendingUid !== 0) {
      setBlockChainStatus(`Confirm the pending transaction.`);
    }
  }, [pendingUid]);

  //Check for accepted transactions from pending
  useEffect(() => {
    const listen = async () => {
      let confirmation = false;
      if (!confirmation) {
        const response = await listenPendingTxn(
          setBlockChainStatus,
          pendingUid
        );
        if (response === "confirmation") {
          confirmation = true;
        }
      }
    };
    listen();
  }, [pendingUid]);

  return (
    <div className="border-[2px] w-[80%] p-4 bg-[black]/50">
      {set} status: {msg}
    </div>
  );
};
