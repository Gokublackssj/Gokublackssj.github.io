import type { ImageMetadata } from "astro";

import qfCorrection from "../assets/shots/quoteflow/correction-highlighted.png";
import qfReview from "../assets/shots/quoteflow/review.png";
import qfConfirm from "../assets/shots/quoteflow/confirm-dialog.png";
import qfRejected from "../assets/shots/quoteflow/upload-rejected.png";
import qfImports from "../assets/shots/quoteflow/imports.png";
import qfSaved from "../assets/shots/quoteflow/saved-records.png";
import qfDark from "../assets/shots/quoteflow/dark-review.png";
import qfMobileImports from "../assets/shots/quoteflow/mobile-imports.png";
import qfMobileReview from "../assets/shots/quoteflow/mobile-review.png";
import qfMobileSaved from "../assets/shots/quoteflow/mobile-saved-records.png";

import lfList from "../assets/shots/leadflow/crm-list.png";
import lfDetail from "../assets/shots/leadflow/crm-detail.png";
import lfFormError from "../assets/shots/leadflow/form-error.png";
import lfDuplicate from "../assets/shots/leadflow/form-duplicate.png";
import lfFilter from "../assets/shots/leadflow/crm-filter.png";
import lfDark from "../assets/shots/leadflow/crm-dark.png";
import lfMobileForm from "../assets/shots/leadflow/mobile-form.png";
import lfMobileCrm from "../assets/shots/leadflow/mobile-crm.png";

export type Shot = { id: string; src: ImageMetadata };
export type ProjectShots = { lead: Shot; desktop: Shot[]; mobile: Shot[] };

// Ids match the caption keys in src/i18n. Order is the gallery order.
export const shots: Record<"quoteflow" | "leadflow", ProjectShots> = {
  quoteflow: {
    lead: { id: "correction", src: qfCorrection },
    desktop: [
      { id: "review", src: qfReview },
      { id: "confirm", src: qfConfirm },
      { id: "rejected", src: qfRejected },
      { id: "imports", src: qfImports },
      { id: "saved", src: qfSaved },
      { id: "dark", src: qfDark },
    ],
    mobile: [
      { id: "mobileImports", src: qfMobileImports },
      { id: "mobileReview", src: qfMobileReview },
      { id: "mobileSaved", src: qfMobileSaved },
    ],
  },
  leadflow: {
    lead: { id: "detail", src: lfDetail },
    desktop: [
      { id: "list", src: lfList },
      { id: "formError", src: lfFormError },
      { id: "duplicate", src: lfDuplicate },
      { id: "filter", src: lfFilter },
      { id: "dark", src: lfDark },
    ],
    mobile: [
      { id: "mobileForm", src: lfMobileForm },
      { id: "mobileCrm", src: lfMobileCrm },
    ],
  },
};
