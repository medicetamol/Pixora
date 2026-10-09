import { Upload } from "lucide-react";

/** Full-width button under the image list (both pages). */
export function AddMoreButton({ onClick }) {
  return <button className="add-images-bottom" onClick={onClick}>
    <Upload size={17}/> Add More Images
  </button>;
}
