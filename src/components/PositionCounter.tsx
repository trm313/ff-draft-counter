export default function PositionCounter({
  positionCounts,
}: {
  positionCounts: any;
}) {
  return (
    <div className="stats shadow w-full">
      {Object.keys(positionCounts).map((position) => (
        <div key={position} className="stat place-items-center">
          <span className="stat-title">{position}</span>
          <span className="stat-value">{positionCounts[position]}</span>
        </div>
      ))}
    </div>
  );
}
