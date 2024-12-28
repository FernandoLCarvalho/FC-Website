import { useTranslations } from "next-intl";
import Image from "next/image";
import { Technologies } from "@/constants/technologies";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-start pt-24 lg:pt-32 pb-24 bg-gradient-to-b from-black to-[#555353]">
      <h1 className="text-3xl font-bold mb-5">{t("ABOUT")}</h1>
      <Image
        src={"/Me.png"}
        alt="Fernando Carvalho"
        width={200}
        height={300}
        className="mb-10 rounded-full"
      />
      <p className="w-4/5 sm:w-2/3 text-center mb-5">{t("DESCRIPTION")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {Technologies.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md"
            style={{ backgroundColor: "rgba(220, 255, 255, 0.3)" }}
          >
            <Image
              src={tech.image}
              alt={tech.name}
              width={40}
              height={40}
              className="mb-4"
            />
            <h3 className="text-lg font-bold text-black">{tech.name}</h3>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center flex-col items-center mt-20">
        <h2 className="text-center">{t("CURRENTLY")}</h2>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_API_KEY}&q=-15.760608,-47.884516`}
          width="350"
          height="350"
          className="mt-5 rounded shadow-lg"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
