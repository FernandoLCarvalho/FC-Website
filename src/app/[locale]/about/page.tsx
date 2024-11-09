export default function AboutPage() {
    return (
        <div className="p-8 flex flex-col items-center justify-center h-[100vh]">
            <h1 className="text-3xl font-bold">About me</h1>
           
            <iframe 
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_API_KEY}&q=-15.760608,-47.884516`}
                width="480" 
                height="480" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                > 
                    
            </iframe>
        </div>
    );
}
