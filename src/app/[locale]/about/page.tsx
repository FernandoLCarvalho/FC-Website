import { useTranslations } from "next-intl";
import Image from "next/image";
import { Technologies } from "@/constants/technologies";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div
      className="p-8 flex flex-col items-center justify-center pt-96 md:pt-96 lg:pt-0 h-[100vh] overflow-scroll bg-gradient-to-b from-[black] to-[#555353]"
      style={{}}
    >
      <Image
        src={"/Me.png"}
        alt="Fernando Carvalho"
        width={200}
        height={300}
        className="mb-10 rounded-full"
      />
      <h1 className="text-3xl font-bold mb-5">{t("ABOUT")}</h1>
      <p className="w-2/3 justify text-center mb-5">{t("DESCRIPTION")}</p>

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
              width={30}
              height={30}
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
          className="h-40 lg:h-64 mt-5 rounded"
          style={{ border: 0, display: "flex", alignSelf: "center" }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
