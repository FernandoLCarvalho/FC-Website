export default function AboutPage() {
    return (
        <div className="p-8 flex flex-col items-center justify-center h-[100vh]">
            <h1 className="text-3xl font-bold">About me</h1>
            <p className="mt-4 text-gray-600">
            <iframe src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d7679.6972565740625!2d-47.88398210000002!3d-15.75914499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d-15.759557999999998!2d-47.884926199999995!5e0!3m2!1spt-BR!2sbr!4v1731040071987!5m2!1spt-BR!2sbr" width="600" height="450" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </p>
        </div>
    );
}
