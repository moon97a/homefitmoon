interface WdogImageProps {
  src: string;
  title: string;
  titleSize: string;
  description: string;
}

interface WdogImageComponentProps {
  wdogImage: WdogImageProps;
}

export default function WdogImage({ wdogImage }: WdogImageComponentProps) {
  const isSmallTitle = wdogImage.titleSize === "xs" || wdogImage.titleSize === "sm";

  return (
    <div className="w-full group relative overflow-hidden rounded-sm shadow-2xl">
      <img 
        src={wdogImage.src} 
        className="w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:-rotate-2"
        alt={wdogImage.title} 
      />
      <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
      <div className={`absolute inset-0 
        flex flex-col justify-end bg-linear-to-t 
        from-black/95 
        text-white
        p-${isSmallTitle ? 2 : 8}
        opacity-0 transition-all delay-200 duration-500 group-hover:opacity-100`}>
        {/* 부모 너비 적응: 좁으면 작게, 넓으면 크게 */}
        <div className={`text-${wdogImage.titleSize} font-bold `}>
          {wdogImage.title}
        </div>
        {/* 설명: xs/sm일 때만 숨김 */}
        {!isSmallTitle && (
          <p className="opacity-90 drop-shadow-lg text-sm leading-relaxed">
            {wdogImage.description}
          </p>
        )}
      </div>
    </div>
  );
}
