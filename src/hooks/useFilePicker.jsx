import { useRef } from "react";

/** Hidden <input type=file> plus an `openPicker` function any button can call. */
export function useFilePicker(onFiles) {
  const ref = useRef(null);
  const picker = <input ref={ref} type="file" accept="image/*" multiple hidden
    onChange={e => { onFiles([...e.target.files]); e.target.value = ""; }} />;
  return { picker, openPicker: () => ref.current?.click() };
}
