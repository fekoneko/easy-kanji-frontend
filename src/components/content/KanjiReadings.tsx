type kunReadingsProps = {
  readings: string[];
};
const KanjiReadings = ({ readings }: kunReadingsProps) => {
  return (
    <>
      {readings.length === 0 ? (
        <span>ー</span>
      ) : (
        readings.map((reading, index) => {
          const readingParts = reading.split('.', 2);
          return (
            <span key={index}>
              {readingParts[0]}
              {readingParts.length > 1 && (
                <span className="text-[#7a7aff] underline dark:text-[#c3c3ff]">
                  {readingParts[1]}
                </span>
              )}
              {index < readings.length - 1 && '、'}
            </span>
          );
        })
      )}
    </>
  );
};
export default KanjiReadings;
