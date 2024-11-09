"use client"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/mainSection.module.css'
import { useTranslations } from "next-intl";




export default function MainSection() {

  const t = useTranslations();

  return (


    <section className='flex flex-row items-center justify-center'>

      <article
        className='flex flex-col items-center justify-center ml-10 mr-10 w-full h-[100vh]'
        style={{ pointerEvents: 'none', zIndex: '1', position: 'relative' }}
      >
        <p className={`${styles.paragragh}`}>{t("BUILDING_SOLUCTIONS")}</p>

        <button className={`whitespace-nowrap uppercase ${styles.button}`} style={{ pointerEvents: 'auto' }}>
          <span>
            {t("QUOTE")}
          </span>
          <FontAwesomeIcon icon={faEnvelope} color="#fff" style={{ width: '15px', height: '15px' }} />
        </button>

      </article>

      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: '0' }}>
        {/* <Scene />  */}
      </div>
    </section>

  );
}
