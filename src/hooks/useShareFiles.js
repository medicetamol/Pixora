import { useState } from "react";
import { canShareFiles, shareItems } from "../utils/image";

/**
 * Drives the Download button. It only uses the share sheet (never several separate
 * downloads), so it is disabled when sharing files is unsupported, or after a share fails.
 * Closing the sheet yourself does not disable it.
 */
export function useShareFiles() {
  const [supported] = useState(canShareFiles);
  const [failed, setFailed] = useState(false);

  const share = async items => {
    const result = await shareItems(items);
    if (result === "failed") setFailed(true);
  };

  return { share, shareDisabled: !supported || failed };
}
