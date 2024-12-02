import { useTranslations } from "next-intl";
import styles from "../../../styles/navbar.module.css";

export default function Faq() {

    const t = useTranslations();
    
  return (
    <section className="h-1/2 lg:w-1/2 w-full">
      <div className="text-white border-b">
        <h2 className="text-xs font-bold mb-4">- Scene Landpage</h2>
        <p className="mb-4 text-xs">License: CC Attribution</p>
        <p className="text-xs mb-2">Author: Sebastian Sosnowski</p>
        <a
          href="https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07"
          className={`text-xs text-blue-300 ${styles.transitionFont}`}
        >
          Link
        </a>
      </div>
      <article className="text-xs font-bold my-4 ">
        <p>- {t('FAQ_02')}</p>
      </article>
    </section>
  );
}
